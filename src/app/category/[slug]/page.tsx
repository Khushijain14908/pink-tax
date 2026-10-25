import { notFound } from "next/navigation";
import ComparisonCard from "@/components/ComparisonCard";
import { CATEGORIES, placeholderPairs } from "@/lib/site";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const pairs = placeholderPairs(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">Category</p>
        <h1 className="mt-1 text-4xl font-extrabold text-gray-900">{category.name}</h1>
        <p className="mt-2 text-gray-600">{category.blurb}</p>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters (non-functional placeholder) */}
        <aside className="w-full shrink-0 rounded-2xl border border-pink-100 bg-pink-50 p-5 lg:w-60">
          <h2 className="font-semibold text-gray-900">Filters</h2>
          <FilterGroup title="Sort by" options={["Biggest markup", "Price: low to high", "Brand"]} />
          <FilterGroup title="Brand" options={["Brand X", "Brand Y", "Brand Z"]} />
          <FilterGroup title="Markup" options={["0–10%", "10–25%", "25%+ (yikes)"]} />
        </aside>

        <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {pairs.map((p) => (
            <ComparisonCard key={p.id} pair={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
        {options.map((o) => (
          <li key={o}>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-pink-600" /> {o}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
