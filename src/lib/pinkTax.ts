// Matching women's/men's products and calculating the markup.
import type { Gender, Product } from "./products";

export type Comparison = {
  markupPct: number; // how much more the women's product costs vs. the men's
  basis: "unit" | "sticker";
  unitLabel: string | null;
};

export type Verdict = "pink-taxed" | "even" | "reverse";

// Below this score two products aren't considered equivalent.
export const MATCH_THRESHOLD = 0.4;

const STOPWORDS = new Set([
  "and", "for", "with", "the", "of", "a", "in", "to", "by", "pack", "count", "ct",
  "oz", "fl", "ml", "size", "new", "set", "women", "womens", "woman", "men", "mens",
  "man", "ladies", "lady", "female", "male", "girls", "boys", "her", "him", "unisex",
]);

export function tokens(text: string, brand = ""): Set<string> {
  const brandWords = new Set(brand.toLowerCase().split(/\W+/));
  return new Set(
    text
      .toLowerCase()
      .replace(/'s\b/g, "")
      .split(/[^a-z]+/)
      .filter((w) => w.length > 1 && !STOPWORDS.has(w) && !brandWords.has(w)),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared / (a.size + b.size - shared);
}

// "Dove Men+Care" and "Dove", or "Gillette Venus" and "Gillette", are the same brand family.
function brandFamily(brand: string): string {
  return brand.toLowerCase().split(/[^a-z0-9]+/)[0] ?? "";
}

/** 0–1 score for how likely two products are the same thing for different genders. */
export function matchScore(a: Product, b: Product): number {
  const sameBrand = !!brandFamily(a.brand) && brandFamily(a.brand) === brandFamily(b.brand);
  const similarity = jaccard(tokens(a.title, a.brand), tokens(b.title, b.brand));
  const sameUnit = !!a.size && a.size.unit === b.size?.unit;
  // A 5-pack vs. a listing with no size, or oz vs. count, can't be compared fairly.
  const comparableSizes = a.size?.unit === b.size?.unit;
  if (similarity < 0.1 || !comparableSizes || conflictingSpecs(a.title, b.title)) return 0;
  return (sameBrand ? 0.4 : 0) + 0.45 * similarity + (sameUnit ? 0.15 : 0);
}

// A 3-blade razor isn't the same product as a 5-blade one, whatever the price.
function conflictingSpecs(a: string, b: string): boolean {
  const blades = (t: string) => t.match(/(\d+)[\s-]*blades?\b/i)?.[1];
  const [ba, bb] = [blades(a), blades(b)];
  return !!ba && !!bb && ba !== bb;
}

export function unitPrice(p: Product): number {
  return p.size ? p.price / p.size.value : p.price;
}

export function compare(womens: Product, mens: Product): Comparison {
  const perUnit = !!womens.size && womens.size.unit === mens.size?.unit;
  const w = perUnit ? unitPrice(womens) : womens.price;
  const m = perUnit ? unitPrice(mens) : mens.price;
  return {
    markupPct: Math.round(((w - m) / m) * 1000) / 10,
    basis: perUnit ? "unit" : "sticker",
    unitLabel: perUnit ? (womens.size!.unit === "oz" ? "per oz" : "per item") : null,
  };
}

export function verdict(markupPct: number): Verdict {
  if (markupPct >= 5) return "pink-taxed";
  if (markupPct <= -5) return "reverse";
  return "even";
}

export function oppositeGender(g: Gender): "women" | "men" | null {
  return g === "women" ? "men" : g === "men" ? "women" : null;
}

/** Best equivalent for `product` among `candidates` of the opposite gender. */
export function findBestMatch(product: Product, candidates: Product[]) {
  const target = oppositeGender(product.gender);
  let best: { product: Product; score: number } | null = null;
  for (const c of candidates) {
    if (c.gender !== target || c.asin === product.asin) continue;
    const score = matchScore(product, c);
    if (score >= MATCH_THRESHOLD && (!best || score > best.score)) best = { product: c, score };
  }
  return best;
}

/** Greedily pairs women's and men's products, each product used at most once. */
export function pairProducts(womens: Product[], mens: Product[], maxPairs: number) {
  const scored = womens
    .flatMap((w) => mens.map((m) => ({ w, m, score: matchScore(w, m) })))
    .filter((s) => s.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  const used = new Set<string>();
  const pairs: { womens: Product; mens: Product; score: number }[] = [];
  for (const { w, m, score } of scored) {
    if (used.has(w.asin) || used.has(m.asin)) continue;
    used.add(w.asin).add(m.asin);
    pairs.push({ womens: w, mens: m, score });
    if (pairs.length === maxPairs) break;
  }
  return pairs;
}

/** Search keyword for the opposite-gender version of a product. */
export function counterpartKeyword(product: Product): string | null {
  const target = oppositeGender(product.gender);
  if (!target) return null;
  const core = [...tokens(product.title, product.brand)].slice(0, 5).join(" ");
  const brand = product.brand.split(/[^A-Za-z0-9]+/)[0] ?? "";
  return `${target}'s ${brand} ${core}`.replace(/\s+/g, " ").trim();
}
