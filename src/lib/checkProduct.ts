// The link checker: Amazon URL in, pink tax verdict out.
import { fetchProduct, searchProducts } from "./brightdata";
import { findPairByAsin, visiblePairs } from "./catalog";
import { normalizeProduct, type Product } from "./products";
import {
  compare,
  counterpartKeyword,
  findBestMatch,
  unitPrice,
  verdict,
  type Comparison,
  type Verdict,
} from "./pinkTax";

export type CheckResult = {
  product: Product;
  verdict: Verdict | "not-gendered" | "no-match";
  counterpart: Product | null;
  comparison: Comparison | null;
  alternatives: Product[];
  source: "catalog" | "live";
};

export class CheckError extends Error {}

// Survives dev-server hot reloads; resets when the server restarts.
const cache: Map<string, CheckResult> = ((globalThis as Record<string, unknown>).__pinkTaxCache ??=
  new Map()) as Map<string, CheckResult>;

export async function checkProduct(input: string): Promise<CheckResult> {
  const asin = await extractAsin(input);
  const cached = cache.get(asin);
  if (cached) return cached;

  const result = fromCatalog(asin) ?? (await live(asin));
  cache.set(asin, result);
  return result;
}

async function extractAsin(input: string): Promise<string> {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new CheckError("That doesn't look like a link. Paste a full Amazon product URL.");
  }

  // Short links (amzn.to, a.co) redirect to the full product page.
  if (/^(amzn\.to|a\.co|amzn\.com)$/.test(url.hostname)) {
    const res = await fetch(url, { redirect: "manual" });
    const location = res.headers.get("location");
    if (location) url = new URL(location, url);
  }

  if (!/(^|\.)amazon\.com$/.test(url.hostname)) {
    throw new CheckError("Only amazon.com product links are supported right now.");
  }
  const match = url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i);
  if (!match) throw new CheckError("Couldn't find a product in that link. Open the product page and copy its URL.");
  return match[1].toUpperCase();
}

function fromCatalog(asin: string): CheckResult | null {
  const pair = findPairByAsin(asin);
  if (!pair) return null;
  const product = pair.womens.asin === asin ? pair.womens : pair.mens;
  const counterpart = product === pair.womens ? pair.mens : pair.womens;
  const pool = visiblePairs()
    .filter((p) => p.productType === pair.productType)
    .flatMap((p) => [p.womens, p.mens]);
  return {
    product,
    verdict: verdict(pair.markupPct),
    counterpart,
    comparison: pair,
    alternatives: cheaperAlternatives(product, pool, counterpart),
    source: "catalog",
  };
}

async function live(asin: string): Promise<CheckResult> {
  const raw = await fetchProduct(`https://www.amazon.com/dp/${asin}`);
  const product = raw && normalizeProduct(raw);
  if (!product) throw new CheckError("Couldn't read that product from Amazon. It may be unavailable or have no price.");

  const keyword = counterpartKeyword(product);
  if (!keyword) {
    return { product, verdict: "not-gendered", counterpart: null, comparison: null, alternatives: [], source: "live" };
  }

  const results = (await searchProducts(keyword))
    .map(normalizeProduct)
    .filter((p): p is Product => p !== null);
  const match = findBestMatch(product, results);
  if (!match) {
    return { product, verdict: "no-match", counterpart: null, comparison: null, alternatives: [], source: "live" };
  }

  const womens = product.gender === "women" ? product : match.product;
  const mens = product.gender === "women" ? match.product : product;
  const comparison = compare(womens, mens);
  return {
    product,
    verdict: verdict(comparison.markupPct),
    counterpart: match.product,
    comparison,
    alternatives: cheaperAlternatives(product, results, match.product),
    source: "live",
  };
}

/** Up to 3 products not marketed to the same gender, cheaper per unit than the original. */
function cheaperAlternatives(product: Product, pool: Product[], counterpart: Product): Product[] {
  const comparable = (p: Product) => !product.size || p.size?.unit === product.size.unit;
  return pool
    .filter((p) => p.asin !== product.asin && p.asin !== counterpart.asin)
    .filter((p) => p.gender !== product.gender && comparable(p))
    .filter((p) => unitPrice(p) < unitPrice(product))
    .sort((a, b) => unitPrice(a) - unitPrice(b))
    .slice(0, 3);
}
