/**
 * Maps storefront category expressions & regional browsing subjects to
 * valid backend routes and safe, case-insensitive product matching rules.
 * Never fabricates inventory, SKU prices, or stock.
 */

export const STOREFRONT_CATEGORIES = [
  {
    id: "saree",
    label: "Sarees",
    subtitle: "Silks, cottons, and festive drapes",
    route: "/shop/saree",
    allRoute: "/shop/saree/all",
    aliases: ["saree", "sarees"],
    fallbackArt: "/category-tiles/sarees.png",
    section: "featured",
    emptySection: false,
  },
  {
    id: "lehenga",
    label: "Lehengas",
    subtitle: "Bridal and celebration styles",
    route: "/shop/lehenga/all",
    allRoute: "/shop/lehenga/all",
    aliases: ["lehenga", "lehengas", "lengha", "lenghas", "bridal lehenga"],
    fallbackArt: "/category-tiles/lehengas.png",
    section: "featured",
    emptySection: false,
  },
  {
    id: "indo-western",
    label: "Indo-Western",
    subtitle: "Modern silhouettes with festive craft",
    route: "/shop/indo-western/all",
    allRoute: "/shop/indo-western/all",
    aliases: [
      "indo-western",
      "indo western",
      "indowestern",
      "fusion",
      "drape skirt",
      "indo western gown",
      "cape set",
      "co-ord",
    ],
    fallbackArt: "/category-tiles/indo-western.png",
    section: "featured",
    emptySection: false,
  },
  {
    id: "printed-tees",
    label: "Printed Tees",
    subtitle: "Relaxed graphic tees for everyday wear",
    route: "/shop/printed-tees/all",
    allRoute: "/shop/printed-tees/all",
    aliases: [
      "printed-tees",
      "printed tee",
      "printed tees",
      "tee",
      "tees",
      "t-shirt",
      "tshirt",
      "t-shirts",
    ],
    fallbackArt: "/category-tiles/printed-t-shirts.png",
    section: "featured",
    emptySection: false,
  },
  {
    id: "suit",
    label: "Suits",
    subtitle: "Men's tailored suits — coming soon",
    route: "/shop/suit/all",
    allRoute: "/shop/suit/all",
    aliases: ["suit", "suits", "mens suit", "men suit"],
    fallbackArt: "/category-tiles/mens-suits.png",
    section: "men",
    emptySection: true,
  },
  {
    id: "kurta",
    label: "Kurta Pajama",
    subtitle: "Men's kurta pajama — coming soon",
    route: "/shop/kurta/all",
    allRoute: "/shop/kurta/all",
    aliases: ["kurta", "kurtas", "kurta pajama", "kurta-pajama"],
    fallbackArt: "/category-tiles/kurta-pajamas.png",
    section: "men",
    emptySection: true,
  },
  {
    id: "jodhpuri",
    label: "Jodhpuri",
    subtitle: "Men's bandhgala & Jodhpuri — coming soon",
    route: "/shop/jodhpuri/all",
    allRoute: "/shop/jodhpuri/all",
    aliases: ["jodhpuri", "bandhgala"],
    fallbackArt: "/category-tiles/jodhpuri.png",
    section: "men",
    emptySection: true,
  },
];

export const ACTIVE_STOREFRONT_CATEGORIES = STOREFRONT_CATEGORIES.filter(
  (c) => !c.emptySection
);

export const MENS_STOREFRONT_CATEGORIES = STOREFRONT_CATEGORIES.filter(
  (c) => c.section === "men"
);

export const MENS_EMPTY_CATEGORY_IDS = new Set(["suit", "kurta", "jodhpuri"]);

const MENS_EMPTY_ALIASES = new Set([
  "suit",
  "suits",
  "kurta",
  "kurtas",
  "kurta-pajama",
  "jodhpuri",
  "bandhgala",
]);

export const normalizeSlug = (value = "") =>
  String(value).trim().toLowerCase().replace(/[\s_]+/g, "-");

export const isEmptyMensCategory = (slug = "") =>
  MENS_EMPTY_ALIASES.has(normalizeSlug(slug));

export const REGIONAL_TEXTILE_EDITS = [
  {
    slug: "bandhej",
    name: "Bandhej",
    region: "Rajasthan & Gujarat",
    note: "Tie-resist dot motifs celebrated in festive drapes.",
  },
  {
    slug: "leheriya",
    name: "Leheriya",
    region: "Rajasthan",
    note: "Diagonal wave-dyed stripes suited for daytime celebrations.",
  },
  {
    slug: "pashmina",
    name: "Pashmina",
    region: "Kashmir",
    note: "Fine winter warmth with classic motif detailing.",
  },
  {
    slug: "kanjivaram",
    name: "Kanjivaram",
    region: "Tamil Nadu",
    note: "Rich temple-border silks prized for ceremonial occasions.",
  },
  {
    slug: "kosa",
    name: "Kosa",
    region: "Chhattisgarh",
    note: "Naturally textured tussar-family weave with understated luster.",
  },
  {
    slug: "maheshwari",
    name: "Maheshwari",
    region: "Madhya Pradesh",
    note: "Lightweight Narmada-bank weave with reversible borders.",
  },
  {
    slug: "nauvari",
    name: "Nauvari",
    region: "Maharashtra",
    note: "Nine-yard traditional drape honoring celebratory heritage.",
  },
  {
    slug: "paithani",
    name: "Paithani",
    region: "Maharashtra",
    note: "Iconic peacock & geometric pallu compositions.",
  },
];

export const OCCASION_EDITS = [
  {
    id: "wedding",
    label: "Wedding",
    subtitle: "Bridal & ceremony ensembles",
    route: "/shop/lehenga/all",
    keywords: [
      "wedding",
      "bridal",
      "lehenga",
      "lengha",
      "paithani",
      "kanjivaram",
      "banarasi",
      "zardozi",
      "indo-western",
      "indo western",
      "fusion",
    ],
  },
  {
    id: "festive",
    label: "Festive",
    subtitle: "Diwali, Navratri & family gatherings",
    route: "/shop/indo-western/all",
    keywords: [
      "festive",
      "silk",
      "bandhej",
      "leheriya",
      "anarkali",
      "maheshwari",
      "indo-western",
      "indo western",
      "fusion",
    ],
  },
  {
    id: "everyday",
    label: "Everyday",
    subtitle: "Breathable cottons & printed tees",
    route: "/shop/printed-tees/all",
    keywords: ["cotton", "everyday", "casual", "tee", "t-shirt", "printed", "linen", "tant"],
  },
  {
    id: "formal",
    label: "Formal",
    subtitle: "Structured drapes & tailored classics",
    route: "/shop/saree/all",
    keywords: ["formal", "organza", "chanderi", "straight", "kosa"],
  },
];

/**
 * Matches a product against a category slug/id across category, subCategory, type, and name
 * so both legacy `product.type === "Saree"` and model `product.category === "Saree"` work safely.
 * Returns false immediately for the currently empty Men's section shelves.
 */
export const matchesCategory = (product, categorySlug) => {
  if (!product) return false;
  if (!categorySlug || normalizeSlug(categorySlug) === "all") return true;
  if (isEmptyMensCategory(categorySlug)) return false;

  const target = normalizeSlug(categorySlug);
  const entry = STOREFRONT_CATEGORIES.find(
    (c) => normalizeSlug(c.id) === target || c.aliases.some((a) => normalizeSlug(a) === target)
  );
  const needles = entry ? entry.aliases.map((a) => a.toLowerCase()) : [target.replace(/-/g, " ")];

  const haystack = [
    product.category,
    product.subCategory,
    product.type,
    product.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return needles.some((needle) => haystack.includes(needle));
};

export const matchesTypeOrKeyword = (product, typeSlug) => {
  if (!product) return false;
  if (!typeSlug || normalizeSlug(typeSlug) === "all") return true;

  const normalized = normalizeSlug(typeSlug).replace(/-/g, " ");
  const tokens = normalized.split(" ").filter(Boolean);
  const haystack = [
    product.type,
    product.subCategory,
    product.category,
    product.name,
    product.print,
    product.state,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (haystack.includes(normalized)) return true;
  // Also allow matching multi-word slug like "banarasi-saree" -> "banarasi"
  return tokens.length > 1 && tokens.every((t) => haystack.includes(t));
};

export const getProductImage = (product, index = 0) => {
  const list = Array.isArray(product?.image)
    ? product.image
    : Array.isArray(product?.images)
    ? product.images
    : product?.image
    ? [product.image]
    : [];
  return list[index] || list[0] || "";
};

export const getAvailableStock = (product) =>
  Math.max(0, (Number(product?.stock) || 0) - (Number(product?.reserved) || 0));

export const getEffectivePrice = (product) => {
  const price = Number(product?.price) || 0;
  const discounted = Number(product?.discountedPrice);
  if (Number.isFinite(discounted) && discounted > 0 && discounted < price) {
    return Math.round(discounted);
  }
  const discount = Number(product?.discount) || 0;
  if (discount > 0 && discount < 100 && price > 0) {
    return Math.round(price - (price * discount) / 100);
  }
  return price;
};

const CATEGORY_TILE_MAP = {
  saree: "/category-tiles/sarees.png",
  sarees: "/category-tiles/sarees.png",
  lehenga: "/category-tiles/lehengas.png",
  lehengas: "/category-tiles/lehengas.png",
  "indo-western": "/category-tiles/indo-western.png",
  indowestern: "/category-tiles/indo-western.png",
  "printed-tees": "/category-tiles/printed-t-shirts.png",
  "printed-t-shirts": "/category-tiles/printed-t-shirts.png",
  "printed-tee": "/category-tiles/printed-t-shirts.png",
  tee: "/category-tiles/printed-t-shirts.png",
  tees: "/category-tiles/printed-t-shirts.png",
  tshirt: "/category-tiles/printed-t-shirts.png",
  "t-shirt": "/category-tiles/printed-t-shirts.png",
  "t-shirts": "/category-tiles/printed-t-shirts.png",
  suit: "/category-tiles/mens-suits.png",
  suits: "/category-tiles/mens-suits.png",
  "mens-suit": "/category-tiles/mens-suits.png",
  "mens-suits": "/category-tiles/mens-suits.png",
  kurta: "/category-tiles/kurta-pajamas.png",
  kurtas: "/category-tiles/kurta-pajamas.png",
  "kurta-pajama": "/category-tiles/kurta-pajamas.png",
  "kurta-pajamas": "/category-tiles/kurta-pajamas.png",
  jodhpuri: "/category-tiles/jodhpuri.png",
  bandhgala: "/category-tiles/jodhpuri.png",
  jewelry: "/category-tiles/jewelry.png",
  jewellery: "/category-tiles/jewelry.png",
};

export const getCategoryTileArt = (idOrName = "", fallback = "") => {
  const slug = normalizeSlug(idOrName);
  if (CATEGORY_TILE_MAP[slug]) return CATEGORY_TILE_MAP[slug];
  for (const [key, art] of Object.entries(CATEGORY_TILE_MAP)) {
    if (slug.includes(key)) return art;
  }
  return fallback || "/category-tiles/sarees.png";
};

export const getSareeTypeTileArt = (slugOrName = "", fallback = "") => {
  const slug = normalizeSlug(slugOrName);
  if (!slug || slug === "all" || slug.includes("all-saree")) {
    return "/saree-tiles/all-sarees.png";
  }
  if (slug.includes("banarasi")) {
    return "/saree-tiles/banarasi-sarees.png";
  }
  if (slug.includes("pashmina")) {
    return "/saree-tiles/pashmina-sarees.png";
  }
  return fallback || "/saree-tiles/all-sarees.png";
};
