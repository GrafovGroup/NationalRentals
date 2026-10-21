import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("industry project picker works without JavaScript and French canonical alias preserves access", async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/en/industries/construction-infrastructure/");
  await page.locator('input[value="excavator"]').check();
  await page.locator('input[value="generator"]').check();
  await page.getByRole("button", { name: "PREPARE REQUEST" }).click();
  await expect(page.locator("#industry")).toHaveValue("construction");
  await expect(page.locator("#products")).toHaveValues([
    "excavator",
    "generator",
  ]);
  await expect(page.locator("#category")).toHaveValue("construction");
  await context.close();
  const response = await request.get("/fr/industries/", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toContain("/fr/secteurs/");
});
test("multi-equipment bilingual inquiry retains industry, products, geography and private project context", async ({
  page,
}) => {
  await page.goto("/en/industries/construction-infrastructure/");
  await page.locator('input[value="excavator"]').check();
  await page.locator('input[value="generator"]').check();
  await page.getByRole("button", { name: "PREPARE REQUEST" }).click();
  await page.locator("#name").fill("Industry Contact");
  await page.locator("#company").fill("Project Company");
  await page.locator("#email").fill("industry@example.com");
  await page.locator("#phone").fill("4165550123");
  await page
    .locator("#details")
    .fill("Two excavators at site one; one generator at site two.");
  await page.getByRole("link", { name: "Passer en français" }).click();
  await expect(page.locator("#products")).toHaveValues([
    "excavator",
    "generator",
  ]);
  await expect(page.locator("#equipment")).toHaveValue("Excavatrices");
  await expect(page.locator("#name")).toHaveValue("Industry Contact");
  await page.goto(
    "/fr/regions/montreal/?industry=construction&products=excavator,generator",
  );
  await page.locator("header a.button").click();
  await expect(page.locator("#city")).toHaveValue("Montréal");
  await expect(page.locator("#industry")).toHaveValue("construction");
  await expect(page.locator("#products")).toHaveValues([
    "excavator",
    "generator",
  ]);
  await page.route("**/api/quote/", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.industry).toBe("construction");
    expect(body.products).toEqual(["excavator", "generator"]);
    expect(body.sourcePath).toBe("/en/industries/construction-infrastructure/");
    expect(body.details).toContain("Two excavators");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        accepted: true,
        notification: "pending",
        reference: body.requestId,
      }),
    });
  });
  await page.locator("#privacy").check();
  await page.getByRole("button", { name: /Envoyer la demande/i }).click();
  await expect(page.getByRole("status")).toContainText("enregistrée");
});
test("industry hub and guides are accessible, responsive and link to real equipment", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const [path, width] of [
    ["/en/industries/", 1280],
    ["/fr/secteurs/sante-etablissements/", 390],
    ["/en/industries/events-exhibitions-conferences/", 1280],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  }
  await page.goto("/en/rentals/construction-earthmoving/excavator/");
  await expect(
    page.getByRole("link", {
      name: "Construction and infrastructure",
      exact: true,
    }),
  ).toHaveAttribute("href", "/en/industries/construction-infrastructure/");
});
