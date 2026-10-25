# PinkAPrice

A satirical shopping site that exposes the **pink tax**: products marketed to women that cost more than the same products marketed to men. It compares real Amazon prices (collected with [Bright Data](https://brightdata.com)) and lets you paste any Amazon link to check if it's pink taxed.

## Run it locally

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone https://github.com/wisharray/pink-tax.git
cd pink-tax
npm install
npm run dev
```

Then open http://localhost:3000.

## Bright Data API key (optional)

**You can run the site without a key.** The product catalog is already saved in the repo, so the category pages and home page work. The link checker also works for products in the catalog.

You only need a key to:
- check Amazon links that **aren't** in the catalog, or
- scrape new product data.

Each person uses **their own key**. Never commit a key to GitHub.

1. Create a free account at [brightdata.com](https://brightdata.com) and create an API key.
2. Copy the template:
   ```bash
   cp .env.example .env.local
   ```
3. Paste your key after `BRIGHTDATA_API_KEY=` in `.env.local`.
4. Restart `npm run dev`.

`.env.local` is git-ignored, so your key stays on your computer.

## Updating the product catalog

The catalog is built in two steps:

```bash
npm run scrape     # searches Amazon for each product type (uses Bright Data credits)
npm run catalog    # pairs women's and men's products (free, no API calls)
```

- Product types are listed in `src/lib/site.ts`.
- `npm run scrape` skips searches already saved in `scripts/raw/`. Use `npm run scrape -- --force` to refresh prices, or `npm run scrape -- razor` for one product type.
- Review `src/data/catalog.json` afterward. Set `"hidden": true` on any bad match to hide it from the site. Rerunning `npm run catalog` keeps those choices.

## How it works

| Piece | File |
|---|---|
| Bright Data API calls | `src/lib/brightdata.ts` |
| Matching women's/men's products and calculating markup | `src/lib/pinkTax.ts` |
| Link checker logic | `src/lib/checkProduct.ts` → `src/app/api/check/route.ts` |
| Saved catalog | `src/data/catalog.json` |

Markups are compared **per unit** (per oz or per item) when both products list a size, since women's products are often sold in smaller sizes.
