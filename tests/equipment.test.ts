import { test } from "node:test";
import assert from "node:assert/strict";
import { categories } from "../src/lib/catalog";
import {
  equipmentItems,
  filterEquipment,
  getEquipment,
  publishedEquipment,
  subcategories,
} from "../src/lib/equipment";
import {
  allRoutes,
  breadcrumbItems,
  equipmentInquiryHref,
  inquiryPrefill,
  pathFor,
  resolveRoute,
} from "../src/lib/routes";
import { locales } from "../src/lib/config";
test("64 substantive equipment records extend all eleven categories and 22 subcategories", () => {
  assert.equal(publishedEquipment.length, 64);
  assert.equal(subcategories.length, 22);
  for (const category of categories) {
    const items = publishedEquipment.filter(
      (i) => i.categoryId === category.id,
    );
    assert.ok(items.length >= 4, category.id);
    for (const summary of category.equipment)
      assert.ok(summary.id === "custom" || getEquipment(summary.id));
  }
  for (const item of equipmentItems) {
    assert.ok(
      subcategories.some(
        (s) => s.id === item.subcategoryId && s.categoryId === item.categoryId,
      ),
    );
    assert.ok(
      item.relatedIds.every((id) => id !== item.id && getEquipment(id)),
    );
    assert.equal(item.inquiry.equipment, item.id);
    for (const locale of locales) {
      assert.ok(item.overview[locale].length > 90, item.id);
      assert.ok(item.selection[locale].length > 100, item.id);
      assert.equal(item.applications.length, 3);
      assert.equal(item.specificationFields.length, 3);
      assert.ok(item.delivery[locale].length > 100);
      assert.match(item.slug[locale], /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  }
});
test("localized product URLs resolve, have category breadcrumbs and unique SEO copy", () => {
  for (const locale of locales) {
    const titles = new Set<string>(),
      descriptions = new Set<string>();
    for (const item of publishedEquipment) {
      const url = pathFor(locale, item.id, "equipment");
      const route = resolveRoute(
        locale,
        url.split("/").filter(Boolean).slice(1),
      )!;
      assert.equal(route.id, item.id);
      assert.equal(route.kind, "equipment");
      const crumbs = breadcrumbItems(locale, route);
      assert.equal(crumbs.length, 4);
      assert.equal(
        crumbs[2].path,
        pathFor(locale, item.categoryId, "category"),
      );
      assert.equal(crumbs[3].path, url);
      assert.ok(!titles.has(item.seo.title[locale]));
      assert.ok(!descriptions.has(item.seo.description[locale]));
      titles.add(item.seo.title[locale]);
      descriptions.add(item.seo.description[locale]);
    }
  }
  assert.equal(
    allRoutes().filter((r) => r.route.kind === "equipment").length,
    128,
  );
  assert.equal(getEquipment("custom"), undefined);
});
test("search combines words, accents, punctuation and applicable filters", () => {
  assert.deepEqual(
    filterEquipment({ keyword: "MINI excavators" }, "en").map((i) => i.id),
    ["mini-excavator"],
  );
  assert.deepEqual(
    filterEquipment({ keyword: "deshumidificateurs" }, "fr").map((i) => i.id),
    ["dehumidifier"],
  );
  assert.ok(
    filterEquipment({ keyword: "beton", category: "construction" }, "fr")
      .length > 1,
  );
  const handling = filterEquipment(
    { category: "aerial", subcategory: "handling", industry: "vehicles" },
    "en",
  );
  assert.deepEqual(
    handling.map((i) => i.id),
    ["telehandler", "forklift", "material-lift"],
  );
  assert.equal(
    filterEquipment({ category: "power", subcategory: "handling" }, "en")
      .length,
    0,
  );
  assert.equal(
    filterEquipment({ keyword: "not-an-equipment-xyz" }, "fr").length,
    0,
  );
  assert.equal(
    filterEquipment({}, "en", [{ ...publishedEquipment[0], status: "draft" }])
      .length,
    0,
  );
});
test("inquiry links prefill every item in both languages and reject mismatched context", () => {
  for (const locale of locales)
    for (const item of publishedEquipment) {
      const url = new URL(
        equipmentInquiryHref(locale, item.id),
        "https://nationalrentals.ca",
      );
      const prefill = inquiryPrefill(
        locale,
        Object.fromEntries(url.searchParams),
      );
      assert.equal(prefill.category, item.categoryId);
      assert.equal(prefill.equipment, item.name[locale]);
      assert.equal(prefill.sourceEquipment, item.id);
      assert.equal(url.hash, "#quote");
    }
  assert.equal(
    inquiryPrefill("fr", {
      category: "power",
      equipment: "excavator",
      source: "excavator",
    }).equipment,
    undefined,
  );
  assert.equal(
    inquiryPrefill("en", {
      category: "construction",
      equipment: "excavator",
      source: "https://evil.test",
    }).sourceEquipment,
    "",
  );
  assert.equal(
    inquiryPrefill("fr", { category: ["construction"], equipment: "excavator" })
      .equipment,
    undefined,
  );
});
