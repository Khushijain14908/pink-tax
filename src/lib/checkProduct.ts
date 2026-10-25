// The link checker: Amazon URL in, pink tax verdict out.
import { fetchProduct, searchProducts } from "./brightdata";
import { allProducts, findPairByAsin } from "./catalog";
import { categoryGender, hasGenderedLines, normalizeProduct, type Product } from "./products";
import {
  alternativesKeyword,
  brandFamily,
  cheaperAlternatives,
  compare,
  counterpartKeyword,
  findBestMatch,
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
  // The product isn't labeled "women's"; it's the brand's regular line vs. its men's line.
  womensUnlabeled?: boolean;
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
  return {
    product,
    verdict: verdict(pair.markupPct),
    counterpart,
    comparison: pair,
    alternatives: cheaperAlternatives(product, allProducts(), pair.womensUnlabeled && product === pair.womens),
    source: "catalog",
    womensUnlabeled: pair.womensUnlabeled,
  };
}

async function live(asin: string): Promise<CheckResult> {
  const raw = await fetchProduct(`https://www.amazon.com/dp/${asin}`);
  const found = raw && normalizeProduct(raw);
  if (!raw || !found) throw new CheckError("Couldn't read that product from Amazon. It may be unavailable or have no price.");

  // Titles often don't say "women's", so fall back to Amazon's category path.
  let product = found.gender === "neutral" ? { ...found, gender: categoryGender(raw) } : found;

  // Still unlabeled, but in personal care or clothing: treat it as the brand's regular line
  // and look for the same brand's men's line (e.g. Dove vs. Dove Men+Care).
  const womensUnlabeled = product.gender === "neutral" && hasGenderedLines(raw) && !!product.brand;
  if (womensUnlabeled) product = { ...product, gender: "women" };

  const empty = { counterpart: null, comparison: null, alternatives: [], source: "live" as const };
  const keyword = counterpartKeyword(product);
  if (!keyword) return { product, verdict: "not-gendered", ...empty };

  // Two searches in parallel: the other gender's version, and other brands for the same audience.
  const normalize = (records: Record<string, unknown>[]) =>
    records.map(normalizeProduct).filter((p): p is Product => p !== null);
  const [counterpartRecords, alternativeRecords] = await Promise.all([
    searchProducts(keyword),
    searchProducts(alternativesKeyword(product, womensUnlabeled)),
  ]);
  let results = normalize(counterpartRecords);
  if (womensUnlabeled) results = results.filter((p) => brandFamily(p.brand) === brandFamily(product.brand));
  const alternatives = cheaperAlternatives(product, normalize(alternativeRecords), womensUnlabeled);

  const match = findBestMatch(product, results);
  if (!match) return { product, verdict: "no-match", ...empty, alternatives, womensUnlabeled };

  const womens = product.gender === "women" ? product : match.product;
  const mens = product.gender === "women" ? match.product : product;
  const comparison = compare(womens, mens);
  return {
    product,
    verdict: verdict(comparison.markupPct),
    counterpart: match.product,
    comparison,
    alternatives,
    source: "live",
    womensUnlabeled,
  };
}
