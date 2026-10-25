import type { CatalogPair } from "@/lib/catalog";
import { formatMarkup } from "@/lib/format";
import ProductTile from "./ProductTile";

export default function ComparisonCard({ pair }: { pair: CatalogPair }) {
  const taxed = pair.markupPct >= 5;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
      <div className="grid flex-1 grid-cols-2 divide-x divide-pink-100">
        <ProductTile product={pair.womens} label="For Her" tone="pink" />
        <ProductTile product={pair.mens} label="For Him" tone="blue" />
      </div>
      <div
        className={`flex items-center justify-between px-4 py-2 text-sm text-white ${taxed ? "bg-pink-600" : "bg-gray-500"}`}
      >
        <span>{taxed ? "Pink Tax" : "No pink tax"} {pair.unitLabel && `(${pair.unitLabel})`}</span>
        <span className="font-bold">{formatMarkup(pair.markupPct)}</span>
      </div>
    </div>
  );
}
