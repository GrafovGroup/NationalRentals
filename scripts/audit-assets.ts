import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { resolve, basename } from "node:path";
import { publishedEquipment } from "../src/lib/equipment";
import { categories } from "../src/lib/catalog";
import { pathFor } from "../src/lib/routes";
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const assets = [
  ...publishedEquipment.flatMap((item) =>
    (["en", "fr"] as const).flatMap((locale) => {
      const image = item.images[locale];
      return image
        ? [
            {
              file: "public" + image.src,
              page: pathFor(locale, item.id, "equipment"),
              placement: "equipment detail image",
              source: image.source,
            },
          ]
        : [];
    }),
  ),
  {
    file: "public/images/home-hero.webp",
    page: "/en/",
    placement: "hero",
    source:
      "Built-in imagegen; original exec-b1a688ce-b4ce-46fc-a470-7e702d5fd8b8.png",
  },
  {
    file: "public/images/home-hero-fr.webp",
    page: "/fr/",
    placement: "hero",
    source:
      "Built-in imagegen; original exec-23626bc3-925d-468c-95e9-c81ffe61e478.png",
  },
  ...["featured-skid-steer", "featured-lift", "featured-power"].map((name) => ({
    file: `public/images/${name}.svg`,
    page: "/en/",
    placement: `featured equipment ${name}`,
    source: "Original editable vector; scripts/create-vectors.py",
  })),
  ...categories.map((c) => ({
    file: `public/images/${c.id}.svg`,
    page: pathFor("en", c.id, "category"),
    placement: "category illustration",
    source: "Original editable vector; scripts/create-vectors.py",
  })),
  ...["en", "fr"].map((locale) => ({
    file: `public/social-${locale}.png`,
    page: `/${locale}/`,
    placement: "homepage social card only",
    source: "Original bilingual social card; scripts/prepare-images.mjs",
  })),
];
async function fingerprint(file: string) {
  const data = await readFile(file);
  const gray = await sharp(data, { limitInputPixels: 50_000_000 })
    .flatten({ background: "#fff" })
    .resize(9, 8, { fit: "fill" })
    .greyscale()
    .raw()
    .toBuffer();
  let bits = "";
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++)
      bits += gray[y * 9 + x] > gray[y * 9 + x + 1] ? "1" : "0";
  return {
    sha256: createHash("sha256").update(data).digest("hex"),
    dhash: BigInt(`0b${bits}`).toString(16).padStart(16, "0"),
  };
}
function distance(a: string, b: string) {
  return (BigInt(`0x${a}`) ^ BigInt(`0x${b}`)).toString(2).replaceAll("0", "")
    .length;
}
async function main() {
  const current = await Promise.all(
    assets.map(async (asset) => ({
      ...asset,
      website: "nationalrentals.ca",
      ...(await fingerprint(asset.file)),
    })),
  );
  const exactDuplicates: string[][] = [];
  const visualCandidates: { a: string; b: string; distance: number }[] = [];
  for (let i = 0; i < current.length; i++)
    for (let j = i + 1; j < current.length; j++) {
      if (current[i].sha256 === current[j].sha256)
        exactDuplicates.push([current[i].file, current[j].file]);
      const d = distance(current[i].dhash, current[j].dhash);
      if (d <= 6)
        visualCandidates.push({
          a: current[i].file,
          b: current[j].file,
          distance: d,
        });
    }
  const priorRoot = process.env.ASSET_AUDIT_PRIOR_ROOT;
  let inspected = 0;
  const skipped: string[] = [];
  if (priorRoot) {
    const files = execFileSync(
      "rg",
      [
        "--files",
        priorRoot,
        "-g",
        "*.png",
        "-g",
        "*.jpg",
        "-g",
        "*.jpeg",
        "-g",
        "*.webp",
        "-g",
        "*.svg",
        "-g",
        "!node_modules",
        "-g",
        "!.next",
        "-g",
        "!dist",
        "-g",
        "!test-results",
        "-g",
        "!playwright-report",
      ],
      { encoding: "utf8" },
    )
      .trim()
      .split("\n")
      .filter((p) => !p.startsWith(resolve(".") + "/"));
    for (const file of files) {
      try {
        const hash = await fingerprint(file);
        inspected++;
        for (const asset of current) {
          if (asset.sha256 === hash.sha256)
            exactDuplicates.push([asset.file, file]);
          const d = distance(asset.dhash, hash.dhash);
          if (d <= 6)
            visualCandidates.push({ a: asset.file, b: file, distance: d });
        }
      } catch {
        skipped.push(file);
      }
    }
  }
  await writeFile(
    "docs/asset-register.json",
    JSON.stringify(
      {
        assets: current,
        identity:
          "Approved red wordmark: public/brand/national-rentals-logo.svg; shared Logo component in all EN/FR headers and footers, generated logo/favicon aliases and homepage social cards. Identity UI is not content imagery.",
      },
      null,
      2,
    ) + "\n",
  );
  const report = {
    date: new Date().toISOString(),
    currentImages: current.length,
    priorImagesInspected: inspected,
    scope: priorRoot
      ? "Accessible local images under configured prior root; remote-only inventories are not accessible."
      : "Current repository only. Set ASSET_AUDIT_PRIOR_ROOT for comparison.",
    exactDuplicates,
    visualCandidates,
    skipped,
  };
  await writeFile(
    priorRoot ? "docs/asset-audit-prior.json" : "docs/asset-audit.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify(
      {
        ...report,
        visualCandidates: visualCandidates.map((c) => ({
          ...c,
          b: basename(c.b),
        })),
      },
      null,
      2,
    ),
  );
  if (exactDuplicates.length) process.exitCode = 1;
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
