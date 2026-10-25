import { SITE_NAME } from "@/lib/site";

type Source = { label: string; url: string };
type Stat = { value: string; label: string; source: Source };

const NYC_STUDY: Source = {
  label: "NYC Consumer Affairs, 2015",
  url: "https://www.nyc.gov/assets/dca/downloads/pdf/partners/Study-of-Gender-Pricing-in-NYC.pdf",
};
const CA_SENATE: Source = {
  label: "California Senate, 2020",
  url: "https://sjud.senate.ca.gov/sites/sjud.senate.ca.gov/files/2.18.2020_sjud_gender_pricing_info_hearing_background_paper.pdf",
};
const EPI_PAY_GAP =
  "https://www.epi.org/blog/gender-wage-gap-persists-in-2023-women-are-paid-roughly-22-less-than-men-on-average/";

const HEADLINE_STATS: Stat[] = [
  { value: "$2,400", label: "more paid by women per year for the same goods and services", source: CA_SENATE },
  { value: "7%", label: "more expensive, on average, for products targeted at women", source: NYC_STUDY },
  { value: "$188,000", label: "paid in pink tax over a lifetime", source: CA_SENATE },
];

const MORE_STATS: Stat[] = [
  { value: "15%", label: "more for women's shirts", source: NYC_STUDY },
  { value: "10%", label: "more for women's jeans", source: NYC_STUDY },
  { value: "8%", label: "more for adult clothing, on average", source: NYC_STUDY },
];

const LAWS = [
  { name: "AB 1287", where: "California state law", url: "https://oag.ca.gov/ab1287" },
  {
    name: "Pink Tax Repeal Act",
    where: "Proposed federal legislation",
    url: "https://www.congress.gov/bill/119th-congress/house-bill/3374",
  },
  {
    name: "General Business Law § 391-u",
    where: "New York state law",
    url: "https://www.nysenate.gov/legislation/laws/GBS/391-U",
  },
];

const SOURCES = [
  {
    title: "From Cradle to Cane: The Cost of Being a Female Consumer",
    publisher: "NYC Department of Consumer Affairs",
    url: "https://www.nyc.gov/assets/dca/downloads/pdf/partners/Study-of-Gender-Pricing-in-NYC.pdf",
  },
  {
    title: "Pink Tax Statistics",
    publisher: "Unbiased",
    url: "https://www.unbiased.com/discover/taxes/pink-tax-statistics#What-is-the-pink-tax",
  },
  {
    title: "Gender Pricing Informational Hearing: Background Paper",
    publisher: "California Senate Judiciary Committee",
    url: "https://sjud.senate.ca.gov/sites/sjud.senate.ca.gov/files/2.18.2020_sjud_gender_pricing_info_hearing_background_paper.pdf",
  },
  {
    title: "The Pink Tax: How Gender-Based Pricing Hurts Women's Buying Power",
    publisher: "U.S. Congress Joint Economic Committee",
    url: "https://www.jec.senate.gov/public/_cache/files/8a42df04-8b6d-4949-b20b-6f40a326db9e/the-pink-tax---how-gender-based-pricing-hurts-women-s-buying-power.pdf",
  },
  {
    title: "Pink Tax Explained",
    publisher: "Plan International UK",
    url: "https://plan-uk.org/our-work/girls-rights/pink-tax-explained",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-pink-600">About</p>
      <h1 className="mt-2 text-4xl font-extrabold text-gray-900">What is the Pink Tax?</h1>
      <p className="mt-6 text-lg text-gray-700">
        The &ldquo;pink tax&rdquo; is a form of gender discrimination in pricing. It isn&apos;t
        necessarily an actual sales tax. Products targeted at women often cost more than the same
        products targeted at men.
      </p>

      {/* Key statistics */}
      <h2 className="mt-12 text-2xl font-bold text-gray-900">Key Statistics</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {HEADLINE_STATS.map((s) => (
          <div key={s.value} className="rounded-2xl bg-pink-600 p-6 text-center text-white">
            <p className="text-3xl font-extrabold">{s.value}</p>
            <p className="mt-2 text-sm text-pink-100">{s.label}</p>
            <a
              href={s.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-pink-200 underline-offset-2 hover:text-white hover:underline"
            >
              Source: {s.source.label}
            </a>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MORE_STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-2xl bg-pink-50 p-4">
            <p className="w-14 shrink-0 text-2xl font-extrabold text-pink-600">{s.value}</p>
            <div>
              <p className="text-sm text-gray-700">{s.label}</p>
              <a
                href={s.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-pink-600 hover:underline"
              >
                Source: {s.source.label}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Laws */}
      <h2 className="mt-14 text-2xl font-bold text-gray-900">Laws Trying to Address the Issue</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {LAWS.map((l) => (
          <li key={l.name}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-full flex-col items-center justify-center gap-1 rounded-2xl border border-pink-100 bg-white px-8 py-6 text-center shadow-sm transition hover:border-pink-300 hover:shadow-md"
            >
              <span className="absolute right-4 top-3 text-pink-400 group-hover:text-pink-600">↗</span>
              <p className="font-semibold text-gray-900 group-hover:text-pink-700">{l.name}</p>
              <p className="text-sm text-gray-500">{l.where}</p>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-xl border-l-4 border-pink-400 bg-pink-50 px-4 py-3 text-gray-700">
        Even with these laws, brands find loopholes, like making minor design changes to justify
        higher prices.
      </p>

      {/* Significance */}
      <h2 className="mt-14 text-2xl font-bold text-gray-900">Why It Matters</h2>
      <p className="mt-3 text-gray-700">
        Combined with lower salaries (women earn about 20% less than men,{" "}
        <a
          href={EPI_PAY_GAP}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:underline"
        >
          per the Economic Policy Institute
        </a>
        ), the pink tax adds to
        women&apos;s economic vulnerability, reinforces gender inequality, and limits access to
        necessary healthcare products.
      </p>
      <p className="mt-3 text-gray-700">
        It is important to raise awareness to this issue and urge brands to be more equitable in their pricing.
      </p>

      <h2 className="mt-14 text-2xl font-bold text-gray-900">Why {SITE_NAME}?</h2>
      <p className="mt-3 text-gray-700">
        Our website uses satire to criticize and bring attention to the unnecessary mark up in price justified by the smallest features targeting female consumers.
        Users can browse side-by-side comparisons, or paste any Amazon product link to see if it&apos;s pink taxed.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-gray-900">How it works</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-700">
        <li>We collect real, live Amazon prices using Bright Data.</li>
        <li>We match women&apos;s products with their men&apos;s equivalents from the same brand.</li>
        <li>We calculate the markup, per item when the sizes differ.</li>
      </ol>

      <h2 className="mt-14 text-2xl font-bold text-gray-900">Learn More</h2>
      <ul className="mt-4 space-y-3">
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-xl border border-pink-100 bg-white px-5 py-4 shadow-sm transition hover:border-pink-300 hover:shadow-md"
            >
              <div>
                <p className="font-medium text-gray-900 group-hover:text-pink-700">{s.title}</p>
                <p className="mt-0.5 text-sm text-gray-500">{s.publisher}</p>
              </div>
              <span className="shrink-0 text-pink-400 group-hover:text-pink-600">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
