import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
async function main() {
  const logo = await readFile("public/brand/national-rentals-logo.svg", "utf8");
  // Generated aliases prevent the old icon from surviving in bookmarks or integrations.
  await writeFile("public/logo.svg", logo);
  await writeFile("src/app/icon.svg", logo);
  // Browser rendering preserves SVG textLength, which librsvg does not support.
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
  });
  let logoPng;
  try {
    const page = await browser.newPage({
      viewport: { width: 360, height: 105 },
    });
    await page.setContent(
      `<style>body{margin:0;background:white}svg{display:block;width:360px;height:105px}</style>${logo}`,
    );
    await page.evaluate(() => document.fonts.ready);
    logoPng = await page.screenshot();
  } finally {
    await browser.close();
  }
  const source = process.argv[2];
  if (source)
    await sharp(source)
      .webp({ quality: 84 })
      .toFile("public/images/home-hero.webp");
  for (const [locale, heading, sub] of [
    [
      "en",
      "Equipment for the work ahead.",
      "COMMERCIAL RENTAL SOLUTIONS ACROSS CANADA",
    ],
    [
      "fr",
      "De l’équipement pour vos projets.",
      "LOCATION COMMERCIALE PARTOUT AU CANADA",
    ],
  ]) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#10243a"/><path d="M900 0h300v630H700z" fill="#19334d"/><rect x="70" y="55" width="390" height="130" fill="white"/><text x="70" y="320" font-family="Arial" font-weight="bold" font-size="51" fill="white">${heading}</text><path d="M70 370h120" stroke="#f58220" stroke-width="8"/><text x="70" y="445" font-family="Arial" font-size="21" letter-spacing="2" fill="#c3d0dc">${sub}</text><text x="70" y="565" font-family="Arial" font-size="22" fill="#f58220">nationalrentals.ca</text></svg>`;
    await sharp(Buffer.from(svg))
      .composite([{ input: logoPng, left: 85, top: 67 }])
      .png()
      .toFile(`public/social-${locale}.png`);
  }
  console.log("Optimized hero and bilingual social cards prepared.");
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
