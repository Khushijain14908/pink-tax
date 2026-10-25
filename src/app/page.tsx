import Image from "next/image";
import Link from "next/link";
import ComparisonCard from "@/components/ComparisonCard";
import EmptyCatalog from "@/components/EmptyCatalog";
import { catalogStats, worstDeals } from "@/lib/catalog";
import { CATEGORIES, TAGLINE } from "@/lib/site";

const CA_SENATE_REPORT =
  "https://sjud.senate.ca.gov/sites/sjud.senate.ca.gov/files/2.18.2020_sjud_gender_pricing_info_hearing_background_paper.pdf";

export default function Home() {
  const featured = worstDeals(3);
  const stats = catalogStats();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-100 via-pink-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">
            New season · Same markup
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            {TAGLINE}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Shop products that cost more because they&apos;re marketed to women. We show you the
            markup, side by side with the men&apos;s version.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/category/hygiene" className="rounded-full bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700">
              Shop the Markup
            </Link>
            <Link href="/check" className="rounded-full border border-pink-300 bg-white px-6 py-3 font-semibold text-pink-700 hover:bg-pink-50">
              Check a Product Link
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-pink-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 text-center sm:grid-cols-3">
          <Stat
            value={stats.avgMarkupPct === null ? "—" : `${stats.avgMarkupPct}%`}
            label={`average markup across ${stats.pairCount} product pairs we checked`}
          />
          <Stat
            value="$2,400"
            label="extra women pay per year for the same goods and services"
            source={{ label: "California Senate, 2020", url: CA_SENATE_REPORT }}
          />
          <Stat value="0" label="reasons razors need to be pink" />
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group rounded-2xl border border-pink-100 bg-pink-50 p-6 transition hover:border-pink-300 hover:shadow-md"
            >
              <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-pink-200">
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-700">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured comparisons */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Today&apos;s Worst Deals</h2>
          <Link href="/category/hygiene" className="text-sm font-medium text-pink-600 hover:underline">
            View all →
          </Link>
        </div>
        {featured.length ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ComparisonCard key={p.id} pair={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyCatalog />
          </div>
        )}
      </section>
    </>
  );
}

function Stat({
  value,
  label,
  source,
}: {
  value: string;
  label: string;
  source?: { label: string; url: string };
}) {
  return (
    <div>
      <p className="text-3xl font-extrabold text-pink-600">{value}</p>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
      {source && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-gray-400 hover:text-pink-600 hover:underline"
        >
          Source: {source.label}
        </a>
      )}
    </div>
  );
}
