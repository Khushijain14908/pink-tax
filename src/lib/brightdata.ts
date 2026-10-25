// Server-only: talks to the Bright Data Web Scraper API. Never import from client components.
// Docs: https://docs.brightdata.com/products/scrapers/amazon/send-first-request

const API = "https://api.brightdata.com/datasets/v3";
const AMAZON_PRODUCTS = process.env.BRIGHTDATA_AMAZON_DATASET_ID ?? "gd_l7q7dkf244hwjntr0";

type RawRecord = Record<string, unknown>;

function apiKey(): string {
  const key = process.env.BRIGHTDATA_API_KEY;
  if (!key) throw new Error("BRIGHTDATA_API_KEY is not set in .env.local");
  return key;
}

async function call(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Bright Data ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res;
}

/** Runs a scrape synchronously; if it takes over Bright Data's 1-minute limit, polls until done. */
async function collect(params: string, body: unknown): Promise<RawRecord[]> {
  const res = await call(`/scrape?dataset_id=${AMAZON_PRODUCTS}&format=json&${params}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (res.status === 202 && data.snapshot_id) return waitForSnapshot(data.snapshot_id);
  return (Array.isArray(data) ? data : [data]).filter((r: RawRecord) => !r.error);
}

async function waitForSnapshot(id: string, timeoutMs = 10 * 60_000): Promise<RawRecord[]> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { status, error_message } = await (await call(`/progress/${id}`)).json();
    if (status === "ready") {
      const res = await call(`/snapshot/${id}?format=json`);
      if (res.status === 200) {
        const data = await res.json();
        return (Array.isArray(data) ? data : []).filter((r: RawRecord) => !r.error);
      }
    } else if (status === "failed" || status === "canceled") {
      throw new Error(`Bright Data snapshot ${id} ${status}: ${error_message ?? "unknown error"}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`Bright Data snapshot ${id} timed out`);
}

/** One Amazon product by URL. */
export async function fetchProduct(url: string): Promise<RawRecord | null> {
  const records = await collect("include_errors=true", [{ url }]);
  return records[0] ?? null;
}

/** Amazon search results for a keyword (like typing into Amazon's search bar). */
export async function searchProducts(keyword: string, limit = 20): Promise<RawRecord[]> {
  return collect("type=discover_new&discover_by=keyword&include_errors=true", {
    input: [{ keyword }],
    limit_per_input: limit,
  });
}
