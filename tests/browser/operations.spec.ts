import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("mobile draft survives language/navigation changes without placing contact data in URLs", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/en/contact/?category=construction&equipment=excavator&source=excavator&market=qc-gatineau&utm_campaign=autumn",
  );
  await page.locator("#name").fill("Draft Person");
  await page.locator("#company").fill("Draft Company");
  await page.locator("#email").fill("draft@example.com");
  await page.locator("#phone").fill("4165550123");
  await page.locator("#quantity").fill("3");
  await page
    .locator("#details")
    .fill("Keep this project description across navigation.");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("link", { name: "Passer en français" }).click();
  await expect(page.locator("#name")).toHaveValue("Draft Person");
  await expect(page.locator("#details")).toHaveValue(
    "Keep this project description across navigation.",
  );
  await expect(page.locator("#quantity")).toHaveValue("3");
  await expect(page.locator("#equipment")).toHaveValue("Excavatrices");
  await expect(page.locator("#province")).toHaveValue("QC");
  await expect(page.locator("#city")).toHaveValue("Gatineau");
  expect(page.url()).not.toContain("Draft");
  expect(page.url()).not.toContain("draft%40");
  await expect(page.locator("#startDate")).not.toHaveAttribute("required", "");
  await page.route("**/api/quote/", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.attribution.utm_campaign).toBe("autumn");
    expect(body.sourceEquipment).toBe("excavator");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        accepted: true,
        reference: body.requestId,
        notification: "failed",
      }),
    });
  });
  await page.locator("#privacy").check();
  await page.getByRole("button", { name: /Envoyer la demande/i }).click();
  await expect(page.getByRole("status")).toContainText("enregistrée");
  await expect(page.getByRole("status")).toContainText(
    "n’a pas encore été confirmé",
  );
  expect(
    await page.evaluate(() => sessionStorage.getItem("nr:quote-draft")),
  ).toBeNull();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test("expired drafts are discarded and a visitor can clear a current draft", async ({
  page,
}) => {
  await page.goto("/en/contact/");
  await page.evaluate(() =>
    sessionStorage.setItem(
      "nr:quote-draft",
      JSON.stringify({
        at: Date.now() - 31 * 60000,
        fields: { name: "Expired Name" },
      }),
    ),
  );
  await page.reload();
  await expect(page.locator("#name")).toHaveValue("");
  await page.locator("#name").fill("Clear Me");
  await page.getByRole("button", { name: "Clear draft", exact: true }).click();
  await expect(page.locator("#name")).toHaveValue("");
  expect(
    await page.evaluate(() => sessionStorage.getItem("nr:quote-draft")),
  ).toBeNull();
});
test("outlined logo rows and speed line share exact visible bounds and no font dependencies", async ({
  page,
}) => {
  await page.goto("/brand/national-rentals-logo.svg");
  const geometry = await page.evaluate(() => {
    const box = (id: string) => {
      const b = (
        document.getElementById(id) as unknown as SVGGraphicsElement
      ).getBBox();
      return { x: b.x, right: b.x + b.width, height: b.height };
    };
    return {
      top: box("national"),
      bottom: box("rentals"),
      line: box("speed-line"),
      texts: document.querySelectorAll("text").length,
    };
  });
  expect(geometry.top.x).toBeCloseTo(geometry.bottom.x, 3);
  expect(geometry.top.right).toBeCloseTo(geometry.bottom.right, 3);
  expect(geometry.top.height).toBeCloseTo(geometry.bottom.height, 3);
  expect(geometry.line.x).toBeCloseTo(geometry.top.x, 3);
  expect(geometry.line.right).toBeCloseTo(geometry.top.right, 3);
  expect(geometry.texts).toBe(0);
});
