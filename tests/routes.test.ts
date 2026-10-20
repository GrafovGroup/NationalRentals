import { test } from "node:test";
import assert from "node:assert/strict";
import { allRoutes, pathFor, resolveRoute, routes } from "../src/lib/routes";
import { categories } from "../src/lib/catalog";
import { regions, locations } from "../src/lib/locations";
import { locales } from "../src/lib/config";
test("all bilingual routes resolve and switch to their matching context", () => {
  assert.equal(allRoutes().length, 218);
  for (const { locale, route } of allRoutes()) {
    assert.equal(
      resolveRoute(locale, route.path.split("/").filter(Boolean))?.id,
      route.id,
    );
    for (const target of locales)
      assert.ok(
        pathFor(target, route.id, route.kind).startsWith(`/${target}/`),
      );
  }
});
test("route and equipment identifiers are unique", () => {
  for (const locale of locales) {
    const list = routes(locale);
    assert.equal(new Set(list.map((r) => r.path)).size, list.length);
  }
  const equipment = categories.flatMap((c) => c.equipment.map((e) => e.id));
  assert.equal(new Set(equipment).size, equipment.length);
});
test("catalog covers eleven substantial bilingual categories and all Canadian regions", () => {
  assert.equal(categories.length, 11);
  assert.equal(regions.length, 13);
  assert.equal(new Set(regions.map((r) => r.code)).size, 13);
  for (const c of categories)
    for (const locale of locales) {
      assert.ok(c.description[locale].length > 100);
      assert.ok(c.planning[locale].length > 80);
      assert.ok(c.equipment.every((e) => e.name[locale]));
    }
  assert.ok(
    locations
      .find((l) => l.id === "toronto")!
      .municipalities.includes("Mississauga"),
  );
  assert.ok(
    locations
      .find((l) => l.id === "montreal")!
      .municipalities.includes("Brossard"),
  );
});
test("unknown and cross-language paths are not resolved", () => {
  assert.equal(resolveRoute("en", ["missing"]), undefined);
  assert.equal(resolveRoute("fr", ["rentals"]), undefined);
});

test("unknown localized URLs receive translated HTTP 404 without JavaScript", async () => {
  const { NextRequest } = await import("next/server");
  const { proxy } = await import("../src/proxy");
  for (const [locale, text] of [
    ["en", "Page not found"],
    ["fr", "Page introuvable"],
  ]) {
    const response = proxy(
      new NextRequest(`https://nationalrentals.ca/${locale}/missing/`),
    );
    assert.equal(response.status, 404);
    const html = await response.text();
    assert.ok(html.includes(`lang="${locale}-CA"`));
    assert.ok(html.includes(text));
    assert.ok(html.includes("noindex"));
  }
  assert.equal(
    proxy(
      new NextRequest("https://nationalrentals.ca/fr/contact/"),
    ).headers.get("x-middleware-next"),
    "1",
  );
});
