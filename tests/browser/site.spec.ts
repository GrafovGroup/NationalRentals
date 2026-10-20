import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { allRoutes, pathFor } from "../../src/lib/routes";
test("all 218 pages respond, identify their language, and expose canonical metadata", async ({
  page,
}) => {
  test.setTimeout(480000);
  const imagePlacements = new Set<string>();
  for (const { locale, route } of allRoutes()) {
    const path = pathFor(locale, route.id, route.kind);
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", `${locale}-CA`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://nationalrentals.ca${path}`,
    );
    await expect(page.locator('link[hreflang="fr-CA"]')).toHaveCount(1);
    for (const src of await page
      .locator("main img")
      .evaluateAll((images) =>
        images.map((image) => (image as HTMLImageElement).src),
      )) {
      const url = new URL(src);
      const asset = url.searchParams.get("url") || url.pathname;
      expect(
        imagePlacements.has(asset),
        `Repeated content image: ${asset}`,
      ).toBe(false);
      imagePlacements.add(asset);
    }
  }
});
test("desktop navigation, language context and equipment prefill work", async ({
  page,
}) => {
  await page.goto("/en/");
  await page.getByRole("button", { name: "Equipment", exact: false }).click();
  await page
    .locator("#equipment-menu")
    .getByRole("link", { name: /Construction/ })
    .click();
  await expect(page).toHaveURL(/construction-earthmoving/);
  await page.getByRole("link", { name: "Passer en français" }).click();
  await expect(page).toHaveURL(/construction-terrassement/);
  await page
    .getByRole("link", { name: "Excavatrices", exact: false })
    .filter({ hasText: "Excavatrices" })
    .first()
    .click();
  await expect(page).toHaveURL(/excavatrices/);
  await page
    .getByRole("link", { name: /Demander une soumission/i })
    .first()
    .click();
  await expect(page.locator("#category")).toHaveValue("construction");
  await expect(page.locator("#equipment")).toHaveValue("Excavatrices");
  await page.getByRole("link", { name: "Switch to English" }).click();
  await expect(page.locator("#category")).toHaveValue("construction");
  await expect(page.locator("#equipment")).toHaveValue("Excavators");
});
test("mobile menu and overflow at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/fr/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.locator("#main-navigation")).toBeVisible();
  await page
    .getByRole("link", { name: "Régions", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL("/fr/regions/");
  for (const url of [
    "/fr/",
    "/en/contact/",
    "/fr/locations-equipement/construction-terrassement/",
  ]) {
    await page.goto(url);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});
test("quote errors are accessible and provider failures preserve details", async ({
  page,
}) => {
  await page.goto("/fr/contact/");
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Veuillez vérifier",
  );
  await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
  await page.locator("#name").fill("Test User");
  await page.locator("#company").fill("Example Inc.");
  await page.locator("#email").fill("test@example.com");
  await page.locator("#phone").fill("4165550123");
  await page.locator("#category").selectOption("construction");
  await page.locator("#equipment").fill("Excavatrice");
  await page.locator("#startDate").fill("2099-05-01");
  await page.locator("#endDate").fill("2099-05-03");
  await page.locator("#city").fill("Montréal");
  await page.locator("#province").selectOption("QC");
  await page.locator("#details").fill("Accès au chantier par la porte nord.");
  await page.locator("#privacy").check();
  await page.route("**/api/quote/", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "unavailable" }),
    }),
  );
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "n’a pas pu être envoyée",
  );
  await expect(page.locator("#name")).toHaveValue("Test User");
  await page.route("**/api/quote/", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, reference: "test-confirmed" }),
    }),
  );
  await page.getByRole("button", { name: "Envoyer la demande" }).click();
  await expect(page.locator("form").getByRole("status")).toContainText(
    "test-confirmed",
  );
  await expect(page.locator("#name")).toHaveCount(0);
});
test("key layouts meet automated WCAG AA checks", async ({ page }) => {
  test.setTimeout(120000);
  for (const url of [
    "/en/",
    "/fr/contact/",
    "/en/rentals/aerial-access-handling/",
    "/fr/regions/montreal/",
  ]) {
    await page.goto(url);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations, url).toEqual([]);
  }
});
test("unknown routes 404 and sitemap includes both languages", async ({
  request,
  page,
}) => {
  expect((await request.get("/en/not-a-page/")).status()).toBe(404);
  const rawMissing = await request.get("/fr/inconnue/");
  expect(await rawMissing.text()).toContain("Page introuvable");
  const missing = await page.goto("/fr/inconnue/");
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page introuvable" }),
  ).toBeVisible();
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/fr/regions/montreal/");
  expect(xml).toContain("/en/rentals/construction-earthmoving/");
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /api/",
  );
});
