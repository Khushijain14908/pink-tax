// Step 2 of building the catalog: pair the raw search results from scripts/raw/ into
// src/data/catalog.json. Free — no API calls. Safe to rerun; pairs you marked
// "hidden": true stay hidden.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { CATEGORIES } from "../src/lib/site";
import { detectGender, normalizeProduct, type Product } from "../src/lib/products";
import { compare, pairProducts } from "../src/lib/pinkTax";
import type { Catalog, CatalogPair } from "../src/lib/catalog";
import { brandRawFile, rawFile } from "./raw-files";

const CATALOG = "src/data/catalog.json";

function load(file: string, keep: (p: Product) => boolean): Product[] {
  if (!existsSync(file)) return [];
  const records = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>[];
  const seenTitles = new Set<string>();
  return records
    .map(normalizeProduct)
    .filter((p): p is Product => p !== null && keep(p))
    .filter((p) => {
      // The same product often appears twice (different colors/sellers); keep one.
      const key = p.title.toLowerCase();
      if (seenTitles.has(key)) return false;
      seenTitles.add(key);
      return true;
    });
}

const previous = JSON.parse(readFileSync(CATALOG, "utf8")) as Catalog;
const hiddenIds = new Set(previous.pairs.filter((p) => p.hidden).map((p) => p.id));

const pairs: CatalogPair[] = [];
const usedAsins = new Set<string>();
const unused = (p: Product) => !usedAsins.has(p.asin);

function addPairs(
  label: string,
  category: string,
  productType: string,
  womens: Product[],
  mens: Product[],
  knownSameBrand = false,
) {
  const matched = pairProducts(womens.filter(unused), mens.filter(unused), Infinity, knownSameBrand);
  console.log(`${label}: ${womens.length} women's, ${mens.length} men's → ${matched.length} pairs`);

  for (const m of matched) {
    const id = `${m.womens.asin}-${m.mens.asin}`;
    usedAsins.add(m.womens.asin).add(m.mens.asin);
    pairs.push({
      id,
      category,
      productType,
      womens: m.womens,
      mens: m.mens,
      matchScore: Math.round(m.score * 100) / 100,
      ...compare(m.womens, m.mens),
      womensUnlabeled: detectGender(m.womens.title) !== "women" || undefined,
      hidden: hiddenIds.has(id),
    });
  }
}

// The brand must be the product's brand (or lead its title), not just mentioned —
// e.g. "Feather Flamingo Facial Razor" isn't a Flamingo product.
const hasBrand = (p: Product, brand: string) =>
  p.brand.toLowerCase().includes(brand) ||
  p.title.toLowerCase().split(/\s+/).slice(0, 3).join(" ").includes(brand);

for (const category of CATEGORIES) {
  // Brand searches first: they give the most reliable matches.
  for (const b of category.brandSearches) {
    // A brand's regular line (e.g. "Dove shampoo") counts as the women's version when the
    // men's line is separate; those pairs are marked womensUnlabeled.
    const womens = load(brandRawFile(b.id, "women"), (p) =>
      hasBrand(p, b.women.brand) && (p.gender === "women" || p.gender === "neutral"),
    ).map((p) => ({ ...p, gender: "women" as const }));
    const mens = load(brandRawFile(b.id, "men"), (p) => hasBrand(p, b.men.brand) && p.gender === "men");
    addPairs(`[brand] ${b.id}`, category.slug, b.productType, womens, mens, true);
  }

  for (const type of category.productTypes) {
    const womens = load(rawFile(type, "women"), (p) => p.gender === "women");
    const mens = load(rawFile(type, "men"), (p) => p.gender === "men");
    addPairs(type, category.slug, type, womens, mens);
  }
}

writeFileSync(CATALOG, JSON.stringify({ generatedAt: new Date().toISOString(), pairs }, null, 2));
console.log(`\nWrote ${pairs.length} pairs to ${CATALOG}. Review them and set "hidden": true on bad matches.`);
