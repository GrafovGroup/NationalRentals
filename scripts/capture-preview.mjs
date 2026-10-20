import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
});
const page = await browser.newPage();
await mkdir("docs/qa", { recursive: true });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
for (const [name, path, width, height] of [
  ["home-en-desktop", "/en/", 1440, 1000],
  ["home-fr-mobile", "/fr/", 390, 844],
  [
    "category-fr-desktop",
    "/fr/locations-equipement/construction-terrassement/",
    1440,
    1000,
  ],
]) {
  await page.setViewportSize({ width, height });
  await page.goto("http://127.0.0.1:3000" + path);
  await page.screenshot({
    path: `docs/qa/${name}.${name === "home-en-desktop" ? "jpg" : "png"}`,
    ...(name === "home-en-desktop" ? { quality: 85 } : {}),
    fullPage: name === "category-fr-desktop",
  });
}
console.log(JSON.stringify({ pageErrors: errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
