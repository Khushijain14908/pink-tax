import type { Product } from "./products";
import { unitPrice } from "./pinkTax";

export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatMarkup(pct: number): string {
  return `${pct > 0 ? "+" : ""}${pct}%`;
}

export function formatUnitPrice(p: Product): string | null {
  if (!p.size) return null;
  return `${formatPrice(unitPrice(p), p.currency)} ${p.size.unit === "oz" ? "/ oz" : "/ item"}`;
}
