import { DatabaseSync } from "node:sqlite";
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  randomUUID,
} from "node:crypto";
import {
  mkdirSync,
  chmodSync,
  realpathSync,
  existsSync,
  lstatSync,
} from "node:fs";
import { dirname, isAbsolute, resolve, relative } from "node:path";
import { type Quote } from "./quote";
import { deliverQuote } from "./delivery";
import { site } from "./config";
export type NotificationStatus =
  | "pending"
  | "sending"
  | "sent"
  | "failed"
  | "review";
type Row = {
  id: string;
  fingerprint: string;
  created_at: number;
  payload: string;
  notification: NotificationStatus;
  attempts: number;
  attempted_at: number | null;
  lease_until: number;
  lease_token: string | null;
  provider_id: string | null;
};
export class SubmissionConflict extends Error {}
function settings() {
  const path = process.env.LEAD_DB_PATH;
  const encoded = process.env.LEAD_ENCRYPTION_KEY;
  if (
    !path ||
    !isAbsolute(path) ||
    !encoded ||
    !/^[A-Za-z0-9+/]{43}=$/.test(encoded)
  )
    throw Error("Lead storage is unconfigured");
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) throw Error("Invalid encryption key");
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const directory = realpathSync(dirname(path));
  const project = realpathSync(process.cwd());
  const location = relative(project, directory);
  if (location !== ".." && !location.startsWith("../"))
    throw Error("Lead storage must be outside the project");
  const file = resolve(directory, path.split("/").at(-1)!);
  if (existsSync(file) && lstatSync(file).isSymbolicLink())
    throw Error("Database symlinks are not supported");
  return { path: file, key };
}
function encrypt(value: unknown, key: Buffer) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64");
}
function decrypt(payload: string, key: Buffer): Quote {
  const bytes = Buffer.from(payload, "base64");
  const cipher = createDecipheriv("aes-256-gcm", key, bytes.subarray(0, 12));
  cipher.setAuthTag(bytes.subarray(12, 28));
  return JSON.parse(
    Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString(
      "utf8",
    ),
  );
}
function open() {
  const config = settings();
  const db = new DatabaseSync(config.path);
  chmodSync(config.path, 0o600);
  db.exec(
    "PRAGMA busy_timeout=5000; PRAGMA journal_mode=DELETE; PRAGMA synchronous=FULL; PRAGMA secure_delete=ON;",
  );
  db.exec(
    `CREATE TABLE IF NOT EXISTS inquiries (id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, created_at INTEGER NOT NULL, payload TEXT NOT NULL, notification TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, attempted_at INTEGER, lease_until INTEGER NOT NULL DEFAULT 0, lease_token TEXT, provider_id TEXT);`,
  );
  return { db, key: config.key };
}
export function saveLead(quote: Quote) {
  quote = {
    ...quote,
    sourcePath: quote.sourcePath || `/${quote.locale}/contact/`,
  };
  const { db, key } = open();
  try {
    const fingerprint = createHmac("sha256", key)
      .update(JSON.stringify(quote))
      .digest("hex");
    db.prepare(
      "INSERT OR IGNORE INTO inquiries (id,fingerprint,created_at,payload) VALUES (?,?,?,?)",
    ).run(quote.requestId, fingerprint, Date.now(), encrypt(quote, key));
    const row = db
      .prepare("SELECT * FROM inquiries WHERE id=?")
      .get(quote.requestId) as Row;
    if (row.fingerprint !== fingerprint)
      throw new SubmissionConflict("Submission key reused with different data");
    // Authenticated decryption detects a wrong key or damaged record before acknowledging a retry.
    decrypt(row.payload, key);
    return { reference: row.id, notification: row.notification };
  } finally {
    db.close();
  }
}
export async function notifyLead(id: string): Promise<NotificationStatus> {
  const { db, key } = open();
  let quote: Quote;
  const token = randomUUID();
  try {
    const now = Date.now();
    // A crashed/in-flight request may have reached the provider. Never automatically retry beyond its 24-hour idempotency window.
    db.prepare(
      "UPDATE inquiries SET notification='review' WHERE id=? AND notification!='sent' AND attempted_at IS NOT NULL AND attempted_at<?",
    ).run(id, now - 23 * 60 * 60 * 1000);
    const row = db.prepare("SELECT * FROM inquiries WHERE id=?").get(id) as
      | Row
      | undefined;
    if (!row) throw Error("Unknown inquiry");
    if (row.notification === "sent" || row.notification === "review")
      return row.notification;
    if (!process.env.RESEND_API_KEY || !process.env.QUOTE_FROM_EMAIL)
      return row.notification;
    quote = decrypt(row.payload, key);
    const claim = db
      .prepare(
        "UPDATE inquiries SET notification='sending',lease_until=?,lease_token=?,attempts=attempts+1,attempted_at=COALESCE(attempted_at,?) WHERE id=? AND notification IN ('pending','failed','sending') AND lease_until<?",
      )
      .run(now + 60000, token, now, id, now);
    if (!claim.changes) return "sending";
  } finally {
    db.close();
  }
  let status: NotificationStatus = "failed";
  let providerId: string | null = null;
  try {
    providerId = await deliverQuote(quote!);
    status = "sent";
  } catch {
    /* Retained for operator recovery; no personal data or provider error logging. */
  }
  const connection = open();
  try {
    connection.db
      .prepare(
        "UPDATE inquiries SET notification=?,provider_id=?,lease_until=0,lease_token=NULL WHERE id=? AND lease_token=?",
      )
      .run(status, providerId, id, token);
  } finally {
    connection.db.close();
  }
  return status;
}
export async function acceptLead(quote: Quote) {
  const saved = saveLead(quote);
  let notification = saved.notification;
  try {
    notification = await notifyLead(saved.reference);
  } catch {
    /* Durable acceptance remains true even if notification status cannot be updated. */
  }
  return {
    ok: true,
    reference: saved.reference,
    accepted: true,
    notification,
    sourceUrl: site.url + (quote.sourcePath || `/${quote.locale}/contact/`),
  };
}
// Local operator CLI only. These functions are never exposed through a web route.
export function leadOperations() {
  const { db, key } = open();
  return {
    list: () =>
      db
        .prepare(
          "SELECT id,created_at,notification,attempts,attempted_at FROM inquiries ORDER BY created_at DESC LIMIT 1000",
        )
        .all(),
    export: (id: string) => {
      const row = db.prepare("SELECT * FROM inquiries WHERE id=?").get(id) as
        | Row
        | undefined;
      if (!row) throw Error("Unknown inquiry");
      return {
        ...row,
        fingerprint: undefined,
        payload: undefined,
        sourceUrl: site.url + decrypt(row.payload, key).sourcePath,
        spamIndicators:
          (decrypt(row.payload, key).details.match(/https?:\/\//g) || [])
            .length > 3
            ? ["multiple-links"]
            : [],
        request: decrypt(row.payload, key),
      };
    },
    remove: (id: string) =>
      db
        .prepare("DELETE FROM inquiries WHERE id=? AND lease_until<?")
        .run(id, Date.now()).changes,
    requeue: (id: string) =>
      db
        .prepare(
          "UPDATE inquiries SET notification='pending',attempted_at=NULL,lease_until=0,lease_token=NULL WHERE id=? AND notification='review' AND lease_until<?",
        )
        .run(id, Date.now()).changes,
    resolveSent: (id: string, providerId: string) =>
      db
        .prepare(
          "UPDATE inquiries SET notification='sent',provider_id=?,lease_until=0,lease_token=NULL WHERE id=? AND lease_until<?",
        )
        .run(providerId, id, Date.now()).changes,
    purge: (days: number) =>
      db
        .prepare("DELETE FROM inquiries WHERE created_at<? AND lease_until<?")
        .run(Date.now() - days * 86400000, Date.now()).changes,
    close: () => db.close(),
  };
}
