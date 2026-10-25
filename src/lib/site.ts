// Site name — change this one constant to rebrand the whole site.
export const SITE_NAME = "PinkAPrice";
export const TAGLINE = "Same product. Different color. Higher price.";

// A brand that sells both a women's and a men's line. Each side is searched separately,
// and only results whose title contains `brand` are kept.
export type BrandSearch = {
  id: string;
  productType: string;
  women: { keyword: string; brand: string };
  men: { keyword: string; brand: string };
};

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  // Free Unsplash photo saved in public/categories/.
  image: { src: string; alt: string };
  // Searched on Amazon as "women's <type>" and "men's <type>" to build the catalog.
  productTypes: string[];
  brandSearches: BrandSearch[];
};

const brand = (
  id: string,
  productType: string,
  women: [keyword: string, brand: string],
  men: [keyword: string, brand: string],
): BrandSearch => ({
  id,
  productType,
  women: { keyword: women[0], brand: women[1] },
  men: { keyword: men[0], brand: men[1] },
});

export const CATEGORIES: Category[] = [
  {
    slug: "clothing",
    name: "Clothing",
    blurb: "Now with fewer pockets at a higher price.",
    image: { src: "/categories/clothing.jpg", alt: "Clothing hanging on racks in a boutique" },
    productTypes: [
      "flannel jacket", "shorts", "jeans", "hoodie", "t-shirt", "sweatpants", "socks", "pajamas",
    ],
    brandSearches: [
      brand("levis-jeans", "jeans", ["Levi's women's jeans", "levi"], ["Levi's men's jeans", "levi"]),
      brand("hanes-tshirt", "t-shirt", ["Hanes women's t-shirt", "hanes"], ["Hanes men's t-shirt", "hanes"]),
      brand("champion-hoodie", "hoodie", ["Champion women's hoodie", "champion"], ["Champion men's hoodie", "champion"]),
      brand("columbia-fleece", "fleece jacket", ["Columbia women's fleece jacket", "columbia"], ["Columbia men's fleece jacket", "columbia"]),
    ],
  },
  {
    slug: "hygiene",
    name: "Hygiene",
    blurb: "Smells like lavender. Costs like a luxury.",
    image: { src: "/categories/hygiene.jpg", alt: "Two pump bottles of face cleanser on a pink background" },
    productTypes: [
      "shampoo", "body wash", "face wash", "conditioner", "shaving cream", "razor", "deodorant",
      "lotion", "lip balm", "sunscreen",
    ],
    brandSearches: [
      brand("dove-shampoo", "shampoo", ["Dove shampoo", "dove"], ["Dove Men+Care shampoo", "dove"]),
      brand("dove-body-wash", "body wash", ["Dove body wash", "dove"], ["Dove Men+Care body wash", "dove"]),
      brand("nivea-face-wash", "face wash", ["Nivea face wash", "nivea"], ["Nivea Men face wash", "nivea"]),
      brand("nivea-lotion", "lotion", ["Nivea body lotion", "nivea"], ["Nivea Men lotion", "nivea"]),
      brand("gillette-shave-gel", "shaving cream", ["Gillette Venus shave gel", "venus"], ["Gillette men's shave gel", "gillette"]),
      brand("flamingo-harrys-razor", "razor", ["Flamingo razor", "flamingo"], ["Harry's razor", "harry"]),
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    blurb: "Accessorize your markup.",
    image: { src: "/categories/accessories.jpg", alt: "Sunglasses, a watch, and a crossbody bag laid out flat" },
    productTypes: [
      "shoes", "bucket hat", "crossbody bag", "phone case", "wallet", "backpack", "sunglasses",
      "watch", "belt",
    ],
    brandSearches: [
      brand("converse-chuck-taylor", "shoes", ["Converse Chuck Taylor women's", "converse"], ["Converse Chuck Taylor men's", "converse"]),
      brand("columbia-bucket-hat", "bucket hat", ["Columbia women's bucket hat", "columbia"], ["Columbia men's bucket hat", "columbia"]),
      brand("herschel-crossbody", "crossbody bag", ["Herschel women's crossbody bag", "herschel"], ["Herschel men's crossbody bag", "herschel"]),
      brand("fossil-watch", "watch", ["Fossil women's watch", "fossil"], ["Fossil men's watch", "fossil"]),
    ],
  },
];

/** Product types shown in a category's filters, including ones only found by brand searches. */
export function categoryProductTypes(category: Category): string[] {
  return [...new Set([...category.productTypes, ...category.brandSearches.map((b) => b.productType)])];
}
