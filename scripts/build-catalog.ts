// Step 2 of building the catalog: pair the raw search results from scripts/raw/ into
// src/data/catalog.json. Free — no API calls. Safe to rerun; pairs you marked
// "hidden": true stay hidden.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { CATEGORIES } from "../src/lib/site";
import { normalizeProduct, type Product } from "../src/lib/products";
import { compare, pairProducts } from "../src/lib/pinkTax";
import type { Catalog, CatalogPair } from "../src/lib/catalog";
import { rawFile } from "./raw-files";

const CATALOG = "src/data/catalog.json";
const PAIRS_PER_TYPE = 4;

function load(type: string, gender: "women" | "men"): Product[] {
  const file = rawFile(type, gender);
  if (!existsSync(file)) return [];
  const records = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>[];
  const seenTitles = new Set<string>();
  return records
    .map(normalizeProduct)
    .filter((p): p is Product => p !== null && p.gender === gender)
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
for (const category of CATEGORIES) {
  for (const type of category.productTypes) {
    const womens = load(type, "women");
    const mens = load(type, "men");
    const matched = pairProducts(womens, mens, PAIRS_PER_TYPE);
    console.log(`${type}: ${womens.length} women's, ${mens.length} men's → ${matched.length} pairs`);

    for (const m of matched) {
      const id = `${m.womens.asin}-${m.mens.asin}`;
      pairs.push({
        id,
        category: category.slug,
        productType: type,
        womens: m.womens,
        mens: m.mens,
        matchScore: Math.round(m.score * 100) / 100,
        ...compare(m.womens, m.mens),
        hidden: hiddenIds.has(id),
      });
    }
  }
}

writeFileSync(CATALOG, JSON.stringify({ generatedAt: new Date().toISOString(), pairs }, null, 2));
console.log(`\nWrote ${pairs.length} pairs to ${CATALOG}. Review them and set "hidden": true on bad matches.`);
