// Reads the scraped catalog (src/data/catalog.json, built by `npm run catalog`).
import catalogData from "@/data/catalog.json";
import productsData from "@/data/products.json";
import type { Product } from "./products";
import type { Comparison } from "./pinkTax";

export type CatalogPair = Comparison & {
  id: string;
  category: string;
  productType: string;
  womens: Product;
  mens: Product;
  matchScore: number;
  // The women's product is a brand's regular line (e.g. "Dove"), not labeled "women's".
  womensUnlabeled?: boolean;
  // Set to true by hand to hide a bad match from the site.
  hidden: boolean;
};

export type Catalog = { generatedAt: string | null; pairs: CatalogPair[] };

const catalog = catalogData as Catalog;

export function visiblePairs(category?: string): CatalogPair[] {
  return catalog.pairs.filter((p) => !p.hidden && (!category || p.category === category));
}

export function worstDeals(count: number): CatalogPair[] {
  return [...visiblePairs()].sort((a, b) => b.markupPct - a.markupPct).slice(0, count);
}

export function findPairByAsin(asin: string): CatalogPair | undefined {
  return visiblePairs().find((p) => p.womens.asin === asin || p.mens.asin === asin);
}

export function catalogStats() {
  const pairs = visiblePairs();
  const taxed = pairs.filter((p) => p.markupPct >= 5);
  const avg = pairs.length ? pairs.reduce((s, p) => s + p.markupPct, 0) / pairs.length : null;
  return {
    pairCount: pairs.length,
    taxedCount: taxed.length,
    avgMarkupPct: avg === null ? null : Math.round(avg),
    generatedAt: catalog.generatedAt,
  };
}

/** Every scraped product (paired or not), for suggesting alternatives. */
export function allProducts(): Product[] {
  return productsData as Product[];
}
