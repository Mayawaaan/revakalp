/**
 * Maps storefront category expressions & regional browsing subjects to
 * valid backend routes and safe, case-insensitive product matching rules.
 * Never fabricates inventory, SKU prices, or stock.
 */

export const STOREFRONT_CATEGORIES = [
  {
    id: "saree",
    label: "Sarees",
    subtitle: "Drapes across regions & occasions",
    route: "/shop/saree",
    allRoute: "/shop/saree/all",
    aliases: ["saree", "sarees"],
    fallbackArt: "/campaign/category-sarees.png",
  },
  {
    id: "lehenga",
    label: "Lehengas",
    subtitle: "Festive & bridal silhouettes",
    route: "/shop/lehenga/all",
    allRoute: "/shop/lehenga/all",
    aliases: ["lehenga", "lehengas", "lengha", "lenghas", "bridal lehenga"],
    fallbackArt: "/campaign/category-lehengas.png",
  },
  {
    id: "kurta",
    label: "Kurta Pajama",
    subtitle: "Tailored everyday & festive kurtas",
    route: "/shop/kurta",
    allRoute: "/shop/kurta/all",
    aliases: ["kurta", "kurtas", "kurta pajama", "kurta-pajama"],
    fallbackArt: "/campaign/category-kurta-pajama.png",
  },
  {
    id: "jodhpuri",
    label: "Jodhpuri",
    subtitle: "Structured bandhgala ensembles",
    route: "/shop/jodhpuri/all",
    allRoute: "/shop/jodhpuri/all",
    aliases: ["jodhpuri", "bandhgala", "indo-western"],
    fallbackArt: "/campaign/category-jodhpuri.png",
  },
  {
    id: "printed-tees",
    label: "Printed Tees",
    subtitle: "Contemporary graphic statements",
    route: "/shop/printed-tees/all",
    allRoute: "/shop/printed-tees/all",
    aliases: ["printed-tees", "printed tee", "printed tees", "tee", "tees", "t-shirt", "tshirt", "t-shirts"],
    fallbackArt: "/campaign/category-printed-tees.png",
  },
];

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
    keywords: ["wedding", "bridal", "lehenga", "lengha", "paithani", "kanjivaram", "banarasi", "zardozi", "jodhpuri", "indo-western"],
  },
  {
    id: "festive",
    label: "Festive",
    subtitle: "Diwali, Navratri & family gatherings",
    keywords: ["festive", "silk", "bandhej", "leheriya", "kurta", "suit", "anarkali", "maheshwari"],
  },
  {
    id: "everyday",
    label: "Everyday",
    subtitle: "Breathable cottons & printed tees",
    keywords: ["cotton", "everyday", "casual", "tee", "t-shirt", "printed", "linen", "tant"],
  },
  {
    id: "formal",
    label: "Formal",
    subtitle: "Structured drapes & tailored classics",
    keywords: ["formal", "jodhpuri", "bandhgala", "organza", "chanderi", "straight", "kosa"],
  },
];

export const normalizeSlug = (value = "") =>
  String(value).trim().toLowerCase().replace(/[\s_]+/g, "-");

/**
 * Matches a product against a category slug/id across category, subCategory, type, and name
 * so both legacy `product.type === "Saree"` and model `product.category === "Saree"` work safely.
 */
export const matchesCategory = (product, categorySlug) => {
  if (!product) return false;
  if (!categorySlug || normalizeSlug(categorySlug) === "all") return true;

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
