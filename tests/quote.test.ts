import { test } from "node:test";
import assert from "node:assert/strict";
import { quoteSchema } from "../src/lib/quote";
import { POST } from "../src/app/api/quote/route";
import { deliverQuote } from "../src/lib/delivery";
import { allowRequest } from "../src/lib/rate-limit";
const quote = {
  locale: "fr",
  requestId: "123e4567-e89b-42d3-a456-426614174000",
  name: "Test User",
  company: "Example Inc.",
  email: "example@example.com",
  phone: "416-555-0123",
  category: "construction",
  equipment: "Excavatrice",
  quantity: 2,
  startDate: "2099-05-01",
  endDate: "2099-05-03",
  city: "Montréal",
  province: "QC",
  delivery: "delivery",
  details: "Access via the north entrance.",
  privacy: true,
  website: "",
};
process.env.RATE_LIMIT_MODE = "single-instance";
process.env.TRUSTED_CLIENT_IP_HEADER = "x-test-ip";
function request(
  body: unknown = quote,
  ip = crypto.randomUUID(),
  origin = "http://localhost:3000",
) {
  return new Request("http://localhost:3000/api/quote/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      "x-test-ip": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}
test("accepts complete bilingual quote and trims input", () => {
  const result = quoteSchema.parse({ ...quote, name: "  Test User  " });
  assert.equal(result.name, "Test User");
});
test("rejects missing consent, honeypot and invalid category/province", () => {
  for (const invalid of [
    { privacy: false },
    { website: "bot" },
    { category: "fake" },
    { province: "XX" },
    { email: "bad" },
    { phone: "-------" },
    { quantity: 0 },
    { quantity: 1.5 },
  ])
    assert.equal(
      quoteSchema.safeParse({ ...quote, ...invalid }).success,
      false,
    );
});
test("rejects inverted, invalid and past dates", () => {
  for (const dates of [
    { endDate: "2099-04-01" },
    { startDate: "2099-02-30" },
    { startDate: "2020-01-01" },
  ])
    assert.equal(quoteSchema.safeParse({ ...quote, ...dates }).success, false);
});
test("validates all required project fields and length limits", () => {
  for (const field of [
    "name",
    "company",
    "email",
    "phone",
    "equipment",
    "city",
    "details",
  ])
    assert.equal(
      quoteSchema.safeParse({ ...quote, [field]: "" }).success,
      false,
    );
  assert.equal(
    quoteSchema.safeParse({ ...quote, details: "x".repeat(5001) }).success,
    false,
  );
});
test("API rejects foreign origins and malformed payloads", async () => {
  assert.equal(
    (
      await POST(
        request(quote, crypto.randomUUID(), "https://attacker.example"),
      )
    ).status,
    403,
  );
  assert.equal((await POST(request("{bad"))).status, 400);
  assert.equal((await POST(request("x".repeat(17000)))).status, 413);
});
test("API returns field errors without attempting delivery", async () => {
  const response = await POST(request({ ...quote, privacy: false }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).fields.privacy, "invalid");
});
test("API never confirms success without configured provider", async () => {
  delete process.env.RESEND_API_KEY;
  delete process.env.QUOTE_FROM_EMAIL;
  const response = await POST(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "unavailable");
});
test("provider acceptance is required and recipient is central contact", async (t) => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.QUOTE_FROM_EMAIL = "quotes@example.com";
  let payload: Record<string, unknown> = {};
  let headers: HeadersInit | undefined;
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, init: RequestInit) => {
      payload = JSON.parse(init.body as string);
      headers = init.headers;
      return Response.json({ id: "provider-id" });
    },
  );
  const response = await POST(
    request({ ...quote, details: "Literal text: <script>alert(1)</script>" }),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).reference, quote.requestId);
  assert.deepEqual(payload.to, ["info@nationalrentals.ca"]);
  assert.equal(payload.reply_to, quote.email);
  assert.equal(payload.html, undefined);
  assert.match(String(payload.text), /Language: fr/);
  assert.equal(
    new Headers(headers).get("Idempotency-Key"),
    `quote/${quote.requestId}`,
  );
  delete process.env.RESEND_API_KEY;
  delete process.env.QUOTE_FROM_EMAIL;
});
test("provider rejection, invalid success body and network failure do not succeed", async (t) => {
  process.env.RESEND_API_KEY = "test-key";
  process.env.QUOTE_FROM_EMAIL = "quotes@example.com";
  for (const outcome of ["reject", "invalid", "network"]) {
    const mock = t.mock.method(globalThis, "fetch", async () => {
      if (outcome === "network") throw new Error("offline");
      return Response.json(outcome === "invalid" ? {} : { error: "bad" }, {
        status: outcome === "reject" ? 500 : 200,
      });
    });
    await assert.rejects(() => deliverQuote(quoteSchema.parse(quote)));
    mock.mock.restore();
  }
  delete process.env.RESEND_API_KEY;
  delete process.env.QUOTE_FROM_EMAIL;
});
test("limits a client after five attempts and isolates other clients", async () => {
  const ip = crypto.randomUUID();
  for (let i = 0; i < 5; i++) assert.equal(await allowRequest(ip), true);
  assert.equal(await allowRequest(ip), false);
  assert.equal(await allowRequest(crypto.randomUUID()), true);
});
test("API exposes retry time on rate limit", async () => {
  const ip = crypto.randomUUID();
  for (let i = 0; i < 5; i++) await allowRequest(ip);
  const result = await POST(request(quote, ip));
  assert.equal(result.status, 429);
  assert.equal(result.headers.get("Retry-After"), "900");
});
test("distributed limiter fails closed on malformed store response", async (t) => {
  process.env.RATE_LIMIT_REDIS_URL = "https://redis.example";
  process.env.RATE_LIMIT_REDIS_TOKEN = "test";
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ error: "unavailable" }),
  );
  await assert.rejects(() => allowRequest("test"));
  delete process.env.RATE_LIMIT_REDIS_URL;
  delete process.env.RATE_LIMIT_REDIS_TOKEN;
});
