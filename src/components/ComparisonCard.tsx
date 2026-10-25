import type { ComparisonPair } from "@/lib/site";

export default function ComparisonCard({ pair }: { pair: ComparisonPair }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-pink-100">
        <ProductSide label="For Her" tone="pink" {...pair.womens} />
        <ProductSide label="For Him" tone="blue" {...pair.mens} />
      </div>
      <div className="flex items-center justify-between bg-pink-600 px-4 py-2 text-sm text-white">
        <span>Pink Tax</span>
        <span className="font-bold">{pair.markup}</span>
      </div>
    </div>
  );
}

function ProductSide({
  label,
  tone,
  name,
  brand,
  price,
}: {
  label: string;
  tone: "pink" | "blue";
  name: string;
  brand: string;
  price: string;
}) {
  const bg = tone === "pink" ? "bg-pink-100" : "bg-sky-100";
  const text = tone === "pink" ? "text-pink-700" : "text-sky-700";
  return (
    <div className="p-4">
      <div className={`mb-3 flex aspect-square items-center justify-center rounded-xl ${bg} text-xs ${text}`}>
        Image
      </div>
      <p className={`text-xs font-semibold uppercase tracking-wide ${text}`}>{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{name}</p>
      <p className="text-xs text-gray-500">{brand}</p>
      <p className="mt-2 text-lg font-bold text-gray-900">{price}</p>
    </div>
  );
}
