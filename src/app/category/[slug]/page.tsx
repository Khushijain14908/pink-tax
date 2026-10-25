import { notFound } from "next/navigation";
import CategoryBrowser from "@/components/CategoryBrowser";
import EmptyCatalog from "@/components/EmptyCatalog";
import { visiblePairs } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/site";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const pairs = visiblePairs(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">Category</p>
        <h1 className="mt-1 text-4xl font-extrabold text-gray-900">{category.name}</h1>
        <p className="mt-2 text-gray-600">{category.blurb}</p>
      </header>

      {pairs.length ? (
        <CategoryBrowser pairs={pairs} productTypes={category.productTypes} />
      ) : (
        <EmptyCatalog />
      )}
    </div>
  );
}
