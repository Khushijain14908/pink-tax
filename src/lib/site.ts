// Placeholder name — swap this one constant to rebrand the whole site.
export const SITE_NAME = "[Site Name]";
export const TAGLINE = "Same product. Different color. Higher price.";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
};

export const CATEGORIES: Category[] = [
  { slug: "clothing", name: "Clothing", blurb: "Now with fewer pockets at a higher price." },
  { slug: "hygiene", name: "Hygiene", blurb: "Smells like lavender. Costs like a luxury." },
  { slug: "accessories", name: "Accessories", blurb: "Accessorize your markup." },
];

export type ComparisonPair = {
  id: string;
  womens: { name: string; brand: string; price: string };
  mens: { name: string; brand: string; price: string };
  markup: string;
};

// Placeholder data until Bright Data scraping is wired up.
export function placeholderPairs(category: string, count = 6): ComparisonPair[] {
  return Array.from({ length: count }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    return {
      id: `${category}-${i}`,
      womens: { name: `Product ${letter} (Women's)`, brand: "Brand X", price: "$X.XX" },
      mens: { name: `Product ${letter} (Men's)`, brand: "Brand X", price: "$Y.YY" },
      markup: "+X%",
    };
  });
}
