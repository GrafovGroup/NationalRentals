import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("catalog filtering works without JavaScript, returns empty states and canonical noindex variants", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/fr/locations-equipement/");
  await page.getByLabel("Mot-clé").fill("deshumidificateurs");
  await page.getByRole("button", { name: "Rechercher", exact: true }).click();
  await expect(page.locator(".catalog-count")).toHaveText(
    "1 type d’équipement",
  );
  await expect(page.locator(".equipment-card h3")).toHaveText(
    /Déshumidificateurs/,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://nationalrentals.ca/fr/locations-equipement/",
  );
  await page.getByLabel("Mot-clé").fill("introuvablexyz");
  await page.getByRole("button", { name: "Rechercher", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Aucun résultat pour ces critères" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Effacer les filtres" }).click();
  await expect(page.locator(".catalog-count")).toHaveText(
    "64 types d’équipement",
  );
  await context.close();
});
test("combined filters, localized item metadata and quote context survive the full journey", async ({
  page,
}) => {
  await page.goto("/en/rentals/");
  await page.locator(".catalog-category-nav summary").focus();
  await page.locator(".catalog-category-nav summary").press("Enter");
  await expect(page.locator(".catalog-category-nav nav a")).toHaveCount(11);
  await expect(
    page.locator(".catalog-category-nav nav a").first(),
  ).toBeVisible();
  await page.locator(".catalog-category-nav summary").press("Enter");
  await page
    .getByRole("combobox", { name: "Category", exact: true })
    .selectOption("aerial");
  await page
    .getByRole("combobox", { name: "Subcategory", exact: true })
    .selectOption("handling");
  await page
    .getByRole("combobox", { name: "Industry", exact: true })
    .selectOption("logistics");
  await page.getByRole("button", { name: "Search equipment" }).click();
  await expect(page.locator(".equipment-card")).toHaveCount(3);
  await page
    .getByRole("link", { name: "Telehandlers", exact: false })
    .first()
    .click();
  await expect(page.locator("h1")).toHaveText("Telehandlers");
  await expect(page.locator('link[hreflang="fr-CA"]')).toHaveAttribute(
    "href",
    /chariots-telescopiques/,
  );
  const data = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(data["@graph"][1].itemListElement).toHaveLength(4);
  await page.getByRole("link", { name: "Passer en français" }).click();
  await expect(page.locator("h1")).toHaveText("Chariots télescopiques");
  await page
    .getByRole("link", { name: /Demander une soumission/i })
    .first()
    .click();
  await expect(page.locator("#equipment")).toHaveValue(
    "Chariots télescopiques",
  );
  await expect(page.locator('input[name="sourceEquipment"]')).toHaveValue(
    "telehandler",
  );
  await page.getByRole("link", { name: "Switch to English" }).click();
  await expect(page.locator("#equipment")).toHaveValue("Telehandlers");
  await expect(page.locator('input[name="sourceEquipment"]')).toHaveValue(
    "telehandler",
  );
  await page.locator("#category").selectOption("power");
  await expect(page.locator('input[name="sourceEquipment"]')).toHaveValue("");
});
test("new catalog layouts are accessible, responsive and preserve the approved logo", async ({
  page,
}) => {
  test.setTimeout(150000);
  for (const path of [
    "/en/rentals/",
    "/fr/locations-equipement/construction-terrassement/excavatrices/",
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".brand img").first()).toHaveAttribute(
      "src",
      "/brand/national-rentals-logo.svg",
    );
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
