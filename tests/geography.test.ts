import { test } from "node:test";
import assert from "node:assert/strict";
import {
  regions,
  locations,
  markets,
  metropolitanAreas,
  localizedCategoryPages,
} from "../src/lib/locations";
import {
  allRoutes,
  pathFor,
  resolveRoute,
  inquiryPrefill,
  breadcrumbItems,
} from "../src/lib/routes";
import { publishedEquipment } from "../src/lib/equipment";
import sitemap from "../src/app/sitemap";
test("geography publishes 13 bilingual hubs and 12 substantial metros with reciprocal stable slugs", () => {
  assert.equal(regions.length, 13);
  assert.equal(locations.length, 12);
  for (const locale of ["en", "fr"] as const) {
    for (const region of regions) {
      const path = pathFor(locale, region.code, "region");
      assert.equal(
        resolveRoute(locale, path.split("/").filter(Boolean).slice(1))?.id,
        region.code,
      );
      assert.ok(region.description[locale].length > 180);
      assert.ok(region.planning[locale].length > 180);
      assert.ok(markets.some((m) => m.region === region.code));
    }
    for (const metro of locations) {
      assert.ok(metro.description[locale].length > 180);
      const route = resolveRoute(
        locale,
        pathFor(locale, metro.id, "location")
          .split("/")
          .filter(Boolean)
          .slice(1),
      )!;
      assert.equal(breadcrumbItems(locale, route).length, 4);
    }
  }
  assert.equal(new Set(markets.map((m) => m.id)).size, markets.length);
  for (const metro of locations)
    for (const member of metro.members) {
      const market = markets.find((m) => m.id === member.id);
      assert.equal(market?.metroId, metro.id);
      assert.equal(market?.region, member.region);
    }
  const crossBorder = metropolitanAreas.find(
    (m) => m.id === "ottawa-gatineau",
  )!;
  assert.deepEqual(crossBorder.regionCodes, ["ON", "QC"]);
  for (const name of ["Gatineau", "Chelsea", "Cantley"])
    assert.equal(markets.find((m) => m.name.en === name)?.region, "QC");
});
test("location prefill retains equipment and resolves city province through trusted IDs", () => {
  const item = publishedEquipment[0];
  for (const locale of ["en", "fr"] as const)
    for (const market of markets) {
      const prefill = inquiryPrefill(locale, {
        market: market.id,
        category: item.categoryId,
        equipment: item.id,
        source: item.id,
      });
      assert.equal(prefill.city, market.name[locale]);
      assert.equal(prefill.province, market.region);
      assert.equal(prefill.sourceEquipment, item.id);
    }
  assert.equal(
    inquiryPrefill("fr", { market: "qc-quebec-city" }).city,
    "Québec",
  );
  assert.equal(
    inquiryPrefill("en", {
      market: "unknown",
      province: "NOT-REAL",
      location: "unknown",
    }).province,
    "",
  );
  assert.equal(inquiryPrefill("en", { province: ["ON", "QC"] }).province, "");
  assert.equal(inquiryPrefill("en", { province: "NU" }).city, "");
  assert.equal(inquiryPrefill("en", { province: "NU" }).province, "NU");
});
test("unpublished city and category-location combinations never enter sitemap or route resolution", () => {
  assert.equal(localizedCategoryPages.length, 0);
  assert.equal(
    resolveRoute("en", ["locations", "ontario", "london"]),
    undefined,
  );
  assert.equal(
    resolveRoute("en", ["locations", "toronto-gta", "construction"]),
    undefined,
  );
  const urls = sitemap().map((p) => p.url);
  assert.equal(urls.length, allRoutes().length);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.every((u) => !u.includes("?")));
});
