// Step 1 of building the catalog: search Amazon for "women's X" and "men's X" for every
// product type and save the raw results to scripts/raw/. Uses Bright Data credits.
//
//   npm run scrape                 # skips searches already saved in scripts/raw/
//   npm run scrape -- --force      # re-scrape everything
//   npm run scrape -- razor        # only product types matching "razor"
//   npm run scrape -- --limit=50 --force shampoo "face wash"   # more results for some types
//
// Then run `npm run catalog` to pair them up (free, no API calls).
import { existsSync, writeFileSync } from "node:fs";
import { CATEGORIES } from "../src/lib/site";
import { searchProducts } from "../src/lib/brightdata";
import { rawFile } from "./raw-files";

const CONCURRENCY = 4;

const args = process.argv.slice(2);
const force = args.includes("--force");
const limitArg = args.find((a) => a.startsWith("--limit="));
const RESULTS_PER_SEARCH = limitArg ? Number(limitArg.split("=")[1]) : 20;
const filters = args.filter((a) => !a.startsWith("--"));

const jobs = CATEGORIES.flatMap((c) => c.productTypes)
  .filter((t) => !filters.length || filters.some((f) => t.includes(f)))
  .flatMap((type) => (["women", "men"] as const).map((gender) => ({ type, gender })))
  .map((j) => ({
    ...j,
    // Bright Data sometimes returns nothing for one phrasing, so fall back to others.
    keywords: [`${j.gender}'s ${j.type}`, `${j.type} for ${j.gender}`, `${j.gender}s ${j.type}`],
    file: rawFile(j.type, j.gender),
  }))
  .filter((j) => force || !existsSync(j.file));

async function run() {
  if (!jobs.length) return console.log("Nothing to scrape (use --force to re-scrape).");
  console.log(`Scraping ${jobs.length} searches, up to ${jobs.length * RESULTS_PER_SEARCH} records.`);

  const queue = [...jobs];
  let failed = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        try {
          let records: Awaited<ReturnType<typeof searchProducts>> = [];
          let keyword = "";
          for (keyword of job.keywords) {
            records = await searchProducts(keyword, RESULTS_PER_SEARCH);
            if (records.length) break;
          }
          if (!records.length) throw new Error("no results for any phrasing");
          // Only save non-empty results, so empty searches are retried next run.
          writeFileSync(job.file, JSON.stringify(records, null, 2));
          console.log(`✓ ${keyword}: ${records.length} results`);
        } catch (err) {
          failed++;
          console.error(`✗ ${job.gender}'s ${job.type}: ${(err as Error).message}`);
        }
      }
    }),
  );
  console.log(failed ? `Done with ${failed} failures. Rerun to retry them.` : "Done.");
}

run();
