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
  ["catalog-en-desktop", "/en/rentals/", 1440, 1000],
  [
    "equipment-en-desktop",
    "/en/rentals/aerial-access-handling/telehandler/",
    1440,
    1000,
  ],
  [
    "equipment-fr-mobile",
    "/fr/locations-equipement/construction-terrassement/excavatrices/",
    390,
    844,
  ],
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
    path: `docs/qa/${name}.${name === "home-fr-mobile" ? "png" : "jpg"}`,
    ...(name === "home-fr-mobile" ? {} : { quality: 85 }),
    fullPage: name === "equipment-en-desktop",
  });
}
console.log(JSON.stringify({ pageErrors: errors }));
await browser.close();
if (errors.length) process.exitCode = 1;
