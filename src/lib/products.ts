// Normalizes raw Bright Data Amazon records and extracts gender + size from titles.

export type Gender = "women" | "men" | "unisex" | "neutral";

export type UnitSize = { value: number; unit: "oz" | "count" };

export type Product = {
  asin: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  url: string;
  image: string | null;
  rating: number | null;
  reviewsCount: number | null;
  gender: Gender;
  size: UnitSize | null;
};

type RawRecord = Record<string, unknown>;

export function normalizeProduct(raw: RawRecord): Product | null {
  const asin = str(raw.asin);
  const title = str(raw.title);
  const price = num(raw.final_price) ?? num(raw.price) ?? num(raw.initial_price);
  if (!asin || !title || price === null || price <= 0) return null;

  return {
    asin,
    title,
    brand: cleanBrand(str(raw.brand)),
    price,
    currency: str(raw.currency) || "USD",
    url: `https://www.amazon.com/dp/${asin}`,
    image: str(raw.image_url) || str(raw.main_image) || str(raw.image) || firstImage(raw.images),
    rating: num(raw.rating),
    reviewsCount: num(raw.reviews_count),
    gender: detectGender(title),
    size: parseSize(title),
  };
}

const WOMEN = /\b(women'?s?|woman|ladies|lady|female|girls?|for her)\b/i;
const MEN = /\b(men'?s?|man|male|boys?|for him)\b/i;

export function detectGender(title: string): Gender {
  if (/\bunisex\b/i.test(title)) return "unisex";
  const w = WOMEN.test(title);
  const m = MEN.test(title);
  if (w && m) return "unisex";
  if (w) return "women";
  if (m) return "men";
  return "neutral";
}

// Sizes are only in the title, so we parse the common formats. fl oz and oz are
// treated as comparable, which is close enough for shampoo vs. shampoo.
const SIZE_PATTERNS: [RegExp, UnitSize["unit"], number][] = [
  [/(\d+(?:\.\d+)?)\s*(?:fl\.?\s*oz|fluid\s*ounces?)/i, "oz", 1],
  [/(\d+(?:\.\d+)?)\s*(?:ml|milliliters?)\b/i, "oz", 1 / 29.5735],
  [/(\d+(?:\.\d+)?)\s*(?:oz|ounces?)\b/i, "oz", 1],
  [/(\d+(?:\.\d+)?)\s*(?:g|grams?)\b/i, "oz", 1 / 28.3495],
  [/(\d+)\s*(?:razor\s+)?(?:blade\s+)?(?:count|ct|cartridges?|refills?)\b/i, "count", 1],
];

export function parseSize(title: string): UnitSize | null {
  // "1/4/5/6 Pack" lists several options in one listing, so the price's size is unknown.
  if (/\d+(?:\s*\/\s*\d+)+\s*(?:pack|pk|count|ct)\b/i.test(title)) return null;

  const packMatch = title.match(/pack of (\d+)|(\d+)[\s-]*(?:pack|pk)\b/i);
  const pack = packMatch ? Number(packMatch[1] ?? packMatch[2]) : 1;
  // "2 Count, 2.7 oz" means two 2.7 oz items.
  const countMatch = title.match(/(\d+)\s*(?:count|ct)\b/i);

  for (const [re, unit, factor] of SIZE_PATTERNS) {
    const m = title.match(re);
    if (!m) continue;
    const multiplier = pack > 1 ? pack : unit === "oz" && countMatch ? Number(countMatch[1]) : 1;
    return { value: Number(m[1]) * factor * multiplier, unit };
  }
  return pack > 1 ? { value: pack, unit: "count" } : null;
}

function cleanBrand(brand: string): string {
  return brand
    .replace(/^brand:\s*/i, "")
    .replace(/^visit the\s+/i, "")
    .replace(/\s+store$/i, "")
    .trim();
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function firstImage(v: unknown): string | null {
  return Array.isArray(v) && typeof v[0] === "string" ? v[0] : null;
}
