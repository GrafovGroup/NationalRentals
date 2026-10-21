import { test } from "node:test";
import assert from "node:assert/strict";
import { publishedIndustries, getIndustry } from "../src/lib/industries";
import { getEquipment } from "../src/lib/equipment";
import { categories } from "../src/lib/catalog";
import { locations } from "../src/lib/locations";
import {
  pathFor,
  resolveRoute,
  inquiryPrefill,
  breadcrumbItems,
} from "../src/lib/routes";
import { quoteSchema } from "../src/lib/quote";
import { generateMetadata } from "../src/app/[locale]/[[...slug]]/page";
test("ten substantial bilingual industries resolve with valid catalog/geography links and reciprocal unique metadata", async () => {
  assert.equal(publishedIndustries.length, 10);
  const titles = new Set();
  const descriptions = new Set();
  for (const item of publishedIndustries) {
    assert.equal(getIndustry(item.id), item);
    assert.ok(
      item.scenarios.length >= 3 &&
        item.planning.length >= 3 &&
        item.faq.length,
    );
    assert.ok(item.equipmentIds.every((id) => getEquipment(id)));
    assert.ok(
      item.categoryIds.every((id) => categories.some((c) => c.id === id)),
    );
    assert.ok(
      item.locationIds.every((id) => locations.some((l) => l.id === id)),
    );
    for (const locale of ["en", "fr"] as const) {
      const path = pathFor(locale, item.id, "industry");
      const slug = path.split("/").filter(Boolean).slice(1);
      const route = resolveRoute(locale, slug)!;
      assert.equal(route.id, item.id);
      assert.equal(route.kind, "industry");
      assert.equal(breadcrumbItems(locale, route).length, 3);
      for (const value of [
        item.title,
        item.headline,
        item.overview,
        ...item.scenarios,
        ...item.planning,
        ...item.faq.flatMap((f) => [f.question, f.answer]),
      ])
        assert.ok(value[locale].length > 8);
      const metadata = await generateMetadata({
        params: Promise.resolve({ locale, slug }),
        searchParams: Promise.resolve({}),
      });
      assert.equal(metadata.alternates?.canonical, path);
      assert.equal(
        metadata.alternates?.languages?.["fr-CA"],
        pathFor("fr", item.id, "industry"),
      );
      assert.ok(!titles.has(metadata.title));
      titles.add(metadata.title);
      assert.ok(!descriptions.has(metadata.description));
      descriptions.add(metadata.description);
    }
  }
});
test("multi-equipment prefill preserves validated industry and geography, drops unknown IDs and caps selections", () => {
  for (const locale of ["en", "fr"] as const) {
    const result = inquiryPrefill(locale, {
      industry: "construction",
      products: ["excavator", "generator", "invented", "excavator"],
      market: "qc-gatineau",
    });
    assert.equal(result.industry, "construction");
    assert.deepEqual(result.products, ["excavator", "generator"]);
    assert.equal(result.category, "construction");
    assert.equal(result.equipment, getEquipment("excavator")!.name[locale]);
    assert.equal(result.city, "Gatineau");
    assert.equal(result.province, "QC");
  }
  assert.equal(inquiryPrefill("en", { industry: "fictional" }).industry, "");
});
test("quote schema rejects fabricated industry/product attribution and excessive or repeated selections", () => {
  const base = {
    locale: "en",
    requestId: "00000000-0000-4000-8000-000000000000",
    name: "Test",
    company: "Example",
    email: "test@example.com",
    phone: "4165550123",
    category: "construction",
    equipment: "Excavator",
    quantity: 1,
    city: "Toronto",
    province: "ON",
    delivery: "discuss",
    details: "Project description",
    privacy: true,
    website: "",
  };
  assert.equal(
    quoteSchema.safeParse({
      ...base,
      industry: "construction",
      products: ["excavator", "generator"],
    }).success,
    true,
  );
  for (const extra of [
    { industry: "fabricated" },
    { products: ["fake"] },
    { products: ["excavator", "excavator"] },
    { products: Array(9).fill("generator") },
  ])
    assert.equal(quoteSchema.safeParse({ ...base, ...extra }).success, false);
});
