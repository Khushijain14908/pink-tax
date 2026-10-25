// Site name — change this one constant to rebrand the whole site.
export const SITE_NAME = "PinkAPrice";
export const TAGLINE = "Same product. Different color. Higher price.";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  // Searched on Amazon as "women's <type>" and "men's <type>" to build the catalog.
  productTypes: string[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "clothing",
    name: "Clothing",
    blurb: "Now with fewer pockets at a higher price.",
    productTypes: ["flannel jacket", "shorts", "jeans", "hoodie", "t-shirt"],
  },
  {
    slug: "hygiene",
    name: "Hygiene",
    blurb: "Smells like lavender. Costs like a luxury.",
    productTypes: [
      "shampoo", "body wash", "face wash", "conditioner", "shaving cream", "razor", "deodorant",
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    blurb: "Accessorize your markup.",
    productTypes: ["shoes", "bucket hat", "crossbody bag", "phone case"],
  },
];
