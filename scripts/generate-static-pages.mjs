#!/usr/bin/env node
/**
 * generate-static-pages.mjs
 *
 * Pre-generates individual page.tsx files for every state, city, and supplier
 * route so Vercel serves them as pure static HTML — no dynamic route functions.
 *
 * Also removes src/app/sitemap.ts so next-sitemap's public/sitemap.xml is
 * served instead of the function-backed app-router version.
 *
 * Usage:
 *   node scripts/generate-static-pages.mjs
 *
 * Add to package.json scripts:
 *   "generate": "node scripts/generate-static-pages.mjs"
 *   "prebuild": "node scripts/generate-static-pages.mjs"
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ─── Load data ────────────────────────────────────────────────────────────────

const citiesData = JSON.parse(
  readFileSync(join(ROOT, "src/content/cities.json"), "utf-8")
);

// Must match src/lib/cityData.ts
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function write(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf-8");
  console.log(`  wrote  ${filePath.replace(ROOT + "/", "")}`);
}

function removeDir(dirPath) {
  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true, force: true });
    console.log(`  removed ${dirPath.replace(ROOT + "/", "")}`);
  }
}

function removeFile(filePath) {
  if (existsSync(filePath)) {
    rmSync(filePath);
    console.log(`  removed ${filePath.replace(ROOT + "/", "")}`);
  }
}

// ─── State pages ──────────────────────────────────────────────────────────────

function generateStatePage(stateName, stateSlug) {
  const title = `Bulk CTC Tea Supplier in ${stateName} | BulkCTC`;
  const description = `Wholesale bulk CTC tea supply for businesses across ${stateName}. Hotels, factories, corporate offices, and institutions. Direct from Assam gardens.`;

  return `// AUTO-GENERATED — do not edit. Run: node scripts/generate-static-pages.mjs
import type { Metadata } from "next";
import { StatePageContent } from "@/components/templates/StatePageContent";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
  alternates: { canonical: "/${stateSlug}" },
};

export default function Page() {
  return <StatePageContent stateSlug=${JSON.stringify(stateSlug)} />;
}
`;
}

// ─── City pages ───────────────────────────────────────────────────────────────

function generateCityPage(cityName, citySlug, stateName, stateSlug) {
  const title = `Bulk CTC Tea Supplier in ${cityName}, ${stateName} | BulkCTC`;
  const description = `Wholesale bulk CTC tea for businesses in ${cityName}, ${stateName}. Direct delivery from Assam gardens. Hotels, factories, corporate offices. Min. order 50 kg.`;

  return `// AUTO-GENERATED — do not edit. Run: node scripts/generate-static-pages.mjs
import type { Metadata } from "next";
import { CityPageContent } from "@/components/templates/CityPageContent";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
  alternates: { canonical: "/${stateSlug}/${citySlug}" },
};

export default function Page() {
  return <CityPageContent stateSlug=${JSON.stringify(stateSlug)} citySlug=${JSON.stringify(citySlug)} />;
}
`;
}

// ─── Supplier pages ───────────────────────────────────────────────────────────

function generateSupplierPage(locationName, locationContext, slug, isState) {
  const title = isState
    ? `Bulk CTC Tea Suppliers in ${locationName} — Gray Cup Enterprises | BulkCTC`
    : `Bulk CTC Tea Suppliers in ${locationName} — Gray Cup Enterprises | BulkCTC`;
  const description = isState
    ? `Gray Cup Enterprises — the only 5-star rated bulk CTC tea supplier across ${locationContext}. Direct Assam & Dooars gardens. Trusted by institutions statewide. 10 verified reviews.`
    : `Gray Cup Enterprises — the only 5-star rated bulk CTC tea supplier in ${locationContext}. Trusted by hotels, factories, and corporate offices. 10 verified reviews.`;

  return `// AUTO-GENERATED — do not edit. Run: node scripts/generate-static-pages.mjs
import type { Metadata } from "next";
import { SupplierPageContent } from "@/components/templates/SupplierPageContent";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
  alternates: { canonical: "/${slug}" },
};

export default function Page() {
  return <SupplierPageContent slug=${JSON.stringify(slug)} />;
}
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const statesDir = join(ROOT, "src/app/(states)");
const suppliersDir = join(ROOT, "src/app/(suppliers)");

let stateCount = 0;
let cityCount = 0;
let supplierCount = 0;

console.log("\n── Generating state pages ──────────────────────────────────────");
for (const [stateName, citiesMap] of Object.entries(citiesData)) {
  const stateSlug = slugify(stateName);
  const pageDir = join(statesDir, stateSlug);
  write(join(pageDir, "page.tsx"), generateStatePage(stateName, stateSlug));
  stateCount++;

  for (const cityName of Object.keys(citiesMap)) {
    const citySlug = slugify(cityName);
    const cityDir = join(statesDir, stateSlug, citySlug);
    write(join(cityDir, "page.tsx"), generateCityPage(cityName, citySlug, stateName, stateSlug));
    cityCount++;
  }
}

console.log("\n── Generating supplier pages ───────────────────────────────────");
for (const [stateName, citiesMap] of Object.entries(citiesData)) {
  const stateSlug = slugify(stateName);
  const stateSupplierSlug = `${stateSlug}-bulk-suppliers`;
  write(
    join(suppliersDir, stateSupplierSlug, "page.tsx"),
    generateSupplierPage(stateName, stateName, stateSupplierSlug, true)
  );
  supplierCount++;

  for (const cityName of Object.keys(citiesMap)) {
    const citySlug = slugify(cityName);
    const citySupplierSlug = `${citySlug}-bulk-suppliers`;
    write(
      join(suppliersDir, citySupplierSlug, "page.tsx"),
      generateSupplierPage(cityName, `${cityName}, ${stateName}`, citySupplierSlug, false)
    );
    supplierCount++;
  }
}

console.log("\n── Removing dynamic route folders ──────────────────────────────");
removeDir(join(statesDir, "[state]"));
removeDir(join(suppliersDir, "[slug]"));

console.log("\n── Removing app-router sitemap (next-sitemap handles this) ─────");
removeFile(join(ROOT, "src/app/sitemap.ts"));

console.log(`
✓ Done
  ${stateCount} state pages
  ${cityCount} city pages
  ${supplierCount} supplier pages
  ${stateCount + cityCount + supplierCount} total static routes
`);
