import { test, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { quoteSchema } from "../src/lib/quote";
import {
  acceptLead,
  saveLead,
  notifyLead,
  leadOperations,
  SubmissionConflict,
} from "../src/lib/leads";
import { POST } from "../src/app/api/quote/route";
const dir = mkdtempSync(join(tmpdir(), "national-lead-test-"));
process.env.LEAD_DB_PATH = join(dir, "leads.sqlite");
process.env.LEAD_ENCRYPTION_KEY = randomBytes(32).toString("base64");
process.env.RESEND_API_KEY = "test-only";
process.env.QUOTE_FROM_EMAIL = "test@example.com";
process.env.RATE_LIMIT_MODE = "single-instance";
process.env.TRUSTED_CLIENT_IP_HEADER = "x-test-client";
const originalFetch = globalThis.fetch;
after(() => {
  globalThis.fetch = originalFetch;
  rmSync(dir, { recursive: true, force: true });
});
const sample = () =>
  quoteSchema.parse({
    requestId: randomUUID(),
    locale: "fr",
    name: "Private Name",
    company: "Example",
    email: "private@example.com",
    phone: "4165550123",
    category: "construction",
    equipment: "Excavatrice",
    quantity: 1,
    startDate: "",
    endDate: "",
    city: "Gatineau",
    province: "QC",
    delivery: "discuss",
    details: "Private project description.",
    privacy: true,
    website: "",
    sourcePath: "/fr/regions/montreal/",
    attribution: { utm_campaign: "private-campaign" },
  });
test("secure persistence precedes notification; duplicate retries send only once and conflicting bodies fail", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({ id: "provider-id" });
  };
  const q = sample();
  const first = await acceptLead(q);
  assert.equal(first.accepted, true);
  assert.equal(first.notification, "sent");
  const second = await acceptLead(q);
  assert.equal(second.reference, first.reference);
  assert.equal(calls, 1);
  assert.throws(() => saveLead({ ...q, company: "Other" }), SubmissionConflict);
  const bytes = readFileSync(process.env.LEAD_DB_PATH!);
  for (const secret of [
    "Private Name",
    "private@example.com",
    "Private project",
    "private-campaign",
  ])
    assert.equal(bytes.includes(secret), false);
  const ops = leadOperations();
  try {
    assert.equal(ops.export(q.requestId).request.city, "Gatineau");
    assert.equal(ops.list().length, 1);
  } finally {
    ops.close();
  }
});
test("email outage retains acceptance, supports retry and prevents simultaneous duplicate notification", async () => {
  const q = sample();
  globalThis.fetch = async () => {
    throw Error("offline");
  };
  const accepted = await acceptLead(q);
  assert.equal(accepted.notification, "failed");
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    await gate;
    return Response.json({ id: "recovered" });
  };
  const retry = notifyLead(q.requestId);
  assert.equal(await notifyLead(q.requestId), "sending");
  release();
  assert.equal(await retry, "sent");
  assert.equal(calls, 1);
});
test("uncertain delivery beyond provider deduplication window requires operator review", async () => {
  const q = sample();
  saveLead(q);
  const db = new DatabaseSync(process.env.LEAD_DB_PATH!);
  db.prepare(
    "UPDATE inquiries SET notification='sending',attempted_at=?,lease_until=0 WHERE id=?",
  ).run(Date.now() - 25 * 3600000, q.requestId);
  db.close();
  globalThis.fetch = async () => {
    throw Error("must not send");
  };
  assert.equal(await notifyLead(q.requestId), "review");
});
test("API accepts saved inquiries during notification failure, enforces body identity and rejects missing origin", async () => {
  globalThis.fetch = async () =>
    Response.json({ error: "offline" }, { status: 503 });
  const q = sample();
  const req = (body: unknown, origin = true) =>
    new Request("http://localhost:3000/api/quote/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-client": randomUUID(),
        ...(origin ? { Origin: "http://localhost:3000" } : {}),
      },
      body: JSON.stringify(body),
    });
  const response = await POST(req(q));
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.accepted, true);
  assert.equal(result.notification, "failed");
  assert.equal((await POST(req({ ...q, company: "Changed" }))).status, 409);
  assert.equal((await POST(req(q, false))).status, 403);
});
test("wrong storage key cannot acknowledge an existing inquiry; records can be deleted", () => {
  const q = sample();
  saveLead(q);
  const key = process.env.LEAD_ENCRYPTION_KEY;
  process.env.LEAD_ENCRYPTION_KEY = randomBytes(32).toString("base64");
  assert.throws(() => saveLead(q));
  process.env.LEAD_ENCRYPTION_KEY = key;
  const ops = leadOperations();
  try {
    assert.equal(Number(ops.remove(q.requestId)), 1);
    assert.throws(() => ops.export(q.requestId));
  } finally {
    ops.close();
  }
});
