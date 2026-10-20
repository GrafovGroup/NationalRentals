import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
async function main() {
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
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#10243a"/><path d="M900 0h300v630H700z" fill="#19334d"/><path d="M70 75h70v70H70z" fill="#f58220"/><text x="90" y="126" font-family="Arial" font-weight="bold" font-size="44" fill="#10243a">N</text><text x="160" y="122" font-family="Arial" font-weight="bold" font-size="34" fill="white">NATIONAL RENTALS.CA</text><text x="70" y="320" font-family="Arial" font-weight="bold" font-size="51" fill="white">${heading}</text><path d="M70 370h120" stroke="#f58220" stroke-width="8"/><text x="70" y="445" font-family="Arial" font-size="21" letter-spacing="2" fill="#c3d0dc">${sub}</text><text x="70" y="565" font-family="Arial" font-size="22" fill="#f58220">nationalrentals.ca</text></svg>`;
    await sharp(Buffer.from(svg)).png().toFile(`public/social-${locale}.png`);
  }
  console.log("Optimized hero and bilingual social cards prepared.");
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
