import Image from "next/image";
import type { Product } from "@/lib/products";
import { formatPrice, formatUnitPrice } from "@/lib/format";

export default function ProductTile({
  product,
  label,
  tone,
}: {
  product: Product;
  label: string;
  tone: "pink" | "blue";
}) {
  const bg = tone === "pink" ? "bg-pink-50" : "bg-sky-50";
  const text = tone === "pink" ? "text-pink-700" : "text-sky-700";
  const unit = formatUnitPrice(product);

  return (
    <a href={product.url} target="_blank" rel="noopener noreferrer" className="group block p-4">
      <div className={`relative mb-3 aspect-square overflow-hidden rounded-xl ${bg}`}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 200px, 45vw"
            className="object-contain p-2 mix-blend-multiply"
          />
        ) : (
          <span className={`flex h-full items-center justify-center text-xs ${text}`}>No image</span>
        )}
      </div>
      <p className={`text-xs font-semibold uppercase tracking-wide ${text}`}>{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-900 group-hover:underline" title={product.title}>
        {product.title}
      </p>
      <p className="text-xs text-gray-500">{product.brand || "Unknown brand"}</p>
      <p className="mt-2 text-lg font-bold text-gray-900">{formatPrice(product.price, product.currency)}</p>
      {unit && <p className="text-xs text-gray-500">{unit}</p>}
    </a>
  );
}
