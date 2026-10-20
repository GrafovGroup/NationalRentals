import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { regions, locations } from "../../src/lib/locations";
import { pathFor } from "../../src/lib/routes";

test("city discovery works without JavaScript and preserves equipment across regional and inquiry links", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/en/locations/?equipment=excavator");
  await page.getByLabel("City or metro area").fill("Gatineau");
  await page.getByRole("button", { name: "SEARCH", exact: true }).click();
  const card = page.locator(".geo-markets article").filter({
    has: page.getByRole("heading", { name: "Gatineau", exact: true }),
  });
  await card.getByRole("link", { name: /Request a quote/i }).click();
  await expect(page.locator("#city")).toHaveValue("Gatineau");
  await expect(page.locator("#province")).toHaveValue("QC");
  await expect(page.locator("#equipment")).toHaveValue("Excavators");
  await expect(page.locator("#category")).toHaveValue("construction");
  await page.goto("/fr/regions/quebec/?q=Quebec");
  await expect(
    page.locator(".geo-markets article h3").filter({ hasText: /^Québec$/ }),
  ).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://nationalrentals.ca/fr/regions/quebec/",
  );
  await page.getByLabel("Ville ou région métropolitaine").fill("zzzzzz");
  await page.getByRole("button", { name: "RECHERCHER", exact: true }).click();
  await expect(page.locator("main")).toContainText("Aucun résultat");
  await context.close();
});
test("metro and territory quote prefill survive language switching, including header CTA", async ({
  page,
}) => {
  await page.goto("/en/locations/ottawa-gatineau/?equipment=excavator");
  await page.locator(".navigation .button").click();
  await expect(page.locator("#city")).toHaveValue("Ottawa");
  await expect(page.locator("#province")).toHaveValue("ON");
  await expect(page.locator("#equipment")).toHaveValue("Excavators");
  await page.getByRole("link", { name: "Passer en français" }).click();
  await expect(page.locator("#equipment")).toHaveValue("Excavatrices");
  await expect(page.locator("#city")).toHaveValue("Ottawa");
  await page.goto(
    "/fr/contact/?market=qc-quebec-city&equipment=excavator&category=construction&source=excavator",
  );
  await expect(page.locator("#city")).toHaveValue("Québec");
  await page.getByRole("link", { name: "Switch to English" }).click();
  await expect(page.locator("#city")).toHaveValue("Québec City");
  await expect(page.locator("#province")).toHaveValue("QC");
  await page.goto("/fr/regions/nunavut/");
  await page.locator("main .button").first().click();
  await expect(page.locator("#province")).toHaveValue("NU");
  await expect(page.locator("#city")).toHaveValue("");
});
test("geographic pages have unique metadata, reciprocal hreflang, valid breadcrumbs and no invented local business schema", async ({
  page,
  request,
}) => {
  test.setTimeout(180000);
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const locale of ["en", "fr"] as const)
    for (const item of [
      ...regions.map((r) => ({ id: r.code, kind: "region" as const })),
      ...locations.map((l) => ({ id: l.id, kind: "location" as const })),
    ]) {
      const path = pathFor(locale, item.id, item.kind);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const title = await page.title();
      expect(titles.has(title)).toBe(false);
      titles.add(title);
      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(descriptions.has(desc!)).toBe(false);
      descriptions.add(desc!);
      for (const lang of ["en", "fr"] as const)
        await expect(
          page.locator(`link[hreflang="${lang}-CA"]`),
        ).toHaveAttribute(
          "href",
          "https://nationalrentals.ca" + pathFor(lang, item.id, item.kind),
        );
      const data = await page
        .locator('script[type="application/ld+json"]')
        .innerText();
      expect(data).not.toContain("LocalBusiness");
      expect(data).not.toContain("streetAddress");
      const crumbs = JSON.parse(data)["@graph"][1].itemListElement;
      expect(crumbs.length).toBe(item.kind === "region" ? 3 : 4);
      const links = await page
        .locator('main a[href^="/"]')
        .evaluateAll((as) =>
          as.map((a) => a.getAttribute("href")!.split("?")[0].split("#")[0]),
        );
      for (const href of new Set(links))
        expect((await request.get(href)).status(), href).toBe(200);
    }
  for (const path of [
    "/en/locations/ontario/london/",
    "/fr/regions/montreal/construction/",
  ])
    expect((await request.get(path)).status()).toBe(404);
});
test("geographic layouts are accessible on mobile and desktop and retain the approved wordmark", async ({
  page,
}) => {
  for (const width of [375, 1280])
    for (const url of [
      "/en/locations/",
      "/fr/regions/ontario/",
      "/en/locations/ottawa-gatineau/",
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator("header img")).toHaveAttribute(
        "src",
        "/brand/national-rentals-logo.svg",
      );
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
});
