import { test } from "node:test";
import assert from "node:assert/strict";
import { measurementSchema, eventNames } from "../src/lib/measurement";
import { POST } from "../src/app/api/measurement/route";
test("measurement accepts only enumerated events and known canonical routes without personal attributes", () => {
  for (const event of eventNames)
    assert.equal(
      measurementSchema.safeParse({ event, path: "/en/locations/" }).success,
      true,
    );
  for (const value of [
    { event: "name=Alice", path: "/en/" },
    { event: "quote_start", path: "/en/?email=x@example.com" },
    { event: "quote_start", path: "/en/unknown/" },
    { event: "quote_start", path: "/en/", email: "private@example.com" },
    { event: "quote_start", path: "/en/#private" },
  ])
    assert.equal(measurementSchema.safeParse(value).success, false);
});
test("measurement adapter forwards only event and canonical URL, never headers or request metadata", async () => {
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "true";
  process.env.ANALYTICS_ENDPOINT = "https://metrics.example.com/events";
  process.env.RATE_LIMIT_MODE = "single-instance";
  const original = globalThis.fetch;
  let payload: Record<string, unknown> = {};
  let headers: unknown;
  globalThis.fetch = async (_url, init) => {
    payload = JSON.parse(String(init?.body));
    headers = init?.headers;
    return new Response(null, { status: 204 });
  };
  try {
    const response = await POST(
      new Request("http://localhost:3000/api/measurement/", {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
          "Content-Type": "application/json",
          "User-Agent": "private-browser",
          Cookie: "private-cookie",
          Referer: "https://external.test/?email=secret",
        },
        body: JSON.stringify({ event: "quote_start", path: "/fr/contact/" }),
      }),
    );
    assert.equal(response.status, 204);
    assert.deepEqual(payload, {
      event: "quote_start",
      url: "https://nationalrentals.ca/fr/contact/",
    });
    assert.equal(JSON.stringify(headers).includes("private"), false);
  } finally {
    globalThis.fetch = original;
    delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
    delete process.env.ANALYTICS_ENDPOINT;
  }
});

test("client measurement requires explicit opt-in and sends no query or visitor details", async () => {
  const { measure } = await import("../src/lib/measurement");
  const oldFetch = globalThis.fetch;
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const oldStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    "sessionStorage",
  );
  let consent = "no";
  const sent: unknown[] = [];
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "true";
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: {
        pathname: "/en/contact/",
        search: "?email=private@example.com",
      },
    },
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: { getItem: () => consent },
  });
  globalThis.fetch = async (_url, init) => {
    sent.push(JSON.parse(String(init?.body)));
    return new Response(null, { status: 204 });
  };
  try {
    measure("quote_start");
    assert.equal(sent.length, 0);
    consent = "yes";
    measure("quote_submit_success");
    assert.deepEqual(sent, [
      { event: "quote_submit_success", path: "/en/contact/" },
    ]);
    consent = "no";
    measure("email_click");
    assert.equal(sent.length, 1);
  } finally {
    globalThis.fetch = oldFetch;
    delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
    if (oldWindow) Object.defineProperty(globalThis, "window", oldWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (oldStorage)
      Object.defineProperty(globalThis, "sessionStorage", oldStorage);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
});
