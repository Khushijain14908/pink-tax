import { catalogStats } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  const { generatedAt } = catalogStats();
  return (
    <footer className="mt-20 border-t border-pink-200 bg-pink-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600">
        <p className="font-semibold text-pink-700">{SITE_NAME}</p>
        <p className="mt-2 max-w-xl">
          A satirical storefront. Nothing here is for sale, but the price differences are real.
        </p>
        <p className="mt-4 text-xs text-gray-400">
          {generatedAt
            ? `Amazon prices collected with Bright Data on ${new Date(generatedAt).toLocaleDateString("en-US", { dateStyle: "long" })}.`
            : "Product data hasn't been collected yet."}{" "}
          Category photos from Unsplash.
        </p>
      </div>
    </footer>
  );
}
