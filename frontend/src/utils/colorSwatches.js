export const PRESET_PRODUCT_COLORS = [
  { name: "Royal Maroon", hex: "#6B1426" },
  { name: "Crimson Red", hex: "#A81C2B" },
  { name: "Rani Pink", hex: "#C2185B" },
  { name: "Blush Rose", hex: "#E5989B" },
  { name: "Emerald Green", hex: "#1B5E3A" },
  { name: "Sage Green", hex: "#7C9070" },
  { name: "Peacock Teal", hex: "#0E6268" },
  { name: "Royal Blue", hex: "#1E3A8A" },
  { name: "Navy Blue", hex: "#1B263B" },
  { name: "Mustard Gold", hex: "#C8962E" },
  { name: "Burnt Orange", hex: "#C85A17" },
  { name: "Ivory Cream", hex: "#F3E8D2" },
  { name: "Pure White", hex: "#FAF9F6" },
  { name: "Charcoal Black", hex: "#1F1D1E" },
  { name: "Plum Purple", hex: "#582C4D" },
  { name: "Lavender", hex: "#9E8FB2" },
  { name: "Beige Sand", hex: "#D6C5A9" },
  { name: "Copper Rust", hex: "#A44A28" },
];

const COLOR_KEYWORDS = [
  ["maroon", "#6B1426"],
  ["burgundy", "#4A1220"],
  ["wine", "#5C1628"],
  ["crimson", "#A81C2B"],
  ["red", "#B91C1C"],
  ["rani", "#C2185B"],
  ["magenta", "#B81D65"],
  ["pink", "#D86C93"],
  ["rose", "#E5989B"],
  ["blush", "#E8B4B8"],
  ["emerald", "#1B5E3A"],
  ["sage", "#7C9070"],
  ["olive", "#5A6B3F"],
  ["green", "#226F45"],
  ["teal", "#0E6268"],
  ["peacock", "#0E6268"],
  ["turquoise", "#148F94"],
  ["navy", "#1B263B"],
  ["indigo", "#2B3A67"],
  ["blue", "#1E40AF"],
  ["mustard", "#C8962E"],
  ["gold", "#D4AF63"],
  ["yellow", "#EAB308"],
  ["orange", "#C85A17"],
  ["coral", "#DF6C57"],
  ["peach", "#F4A28C"],
  ["rust", "#A44A28"],
  ["copper", "#A44A28"],
  ["brown", "#6E473B"],
  ["ivory", "#F3E8D2"],
  ["cream", "#F3E8D2"],
  ["off white", "#F5F2EB"],
  ["white", "#FAF9F6"],
  ["black", "#1F1D1E"],
  ["charcoal", "#2A2728"],
  ["grey", "#7A7D82"],
  ["gray", "#7A7D82"],
  ["silver", "#B8BDC4"],
  ["purple", "#582C4D"],
  ["plum", "#582C4D"],
  ["violet", "#6D3B8E"],
  ["lavender", "#9E8FB2"],
  ["beige", "#D6C5A9"],
  ["sand", "#D6C5A9"],
];

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function resolveColorHex(colorName, colorHex) {
  const trimmedHex = typeof colorHex === "string" ? colorHex.trim() : "";
  if (HEX_RE.test(trimmedHex)) return trimmedHex;

  const normalizedName = typeof colorName === "string" ? colorName.trim().toLowerCase() : "";
  if (normalizedName) {
    const preset = PRESET_PRODUCT_COLORS.find(
      (c) => c.name.toLowerCase() === normalizedName
    );
    if (preset) return preset.hex;

    for (const [keyword, hex] of COLOR_KEYWORDS) {
      if (normalizedName.includes(keyword)) return hex;
    }
  }

  return "#38131E";
}

/**
 * Returns deduplicated sibling color variants for a product by merging
 * backend-provided `product.colorVariants` and the store's `allProducts` list.
 * Matches by normalized `variantGroup` first, falling back to same `name` + `category`
 * when `color` is defined.
 */
export function getProductColorVariants(product, allProducts = []) {
  if (!product) return [];
  const currentId = String(product._id || product.id || "");
  const groupKey = String(product.variantGroup || "").trim().toLowerCase();
  const colorKey = String(product.color || "").trim().toLowerCase();
  const nameKey = String(product.name || "").trim().toLowerCase();
  const categoryKey = String(product.category || "").trim().toLowerCase();

  if (!groupKey && !colorKey) return [];

  const byId = new Map();

  const addCandidate = (candidate) => {
    if (!candidate) return;
    const cid = String(candidate._id || candidate.id || "");
    if (!cid) return;
    if (candidate.status === "archived" && cid !== currentId) return;

    const cGroup = String(candidate.variantGroup || "").trim().toLowerCase();
    const cName = String(candidate.name || "").trim().toLowerCase();
    const cCategory = String(candidate.category || "").trim().toLowerCase();
    const cColor = String(candidate.color || "").trim();

    let matches = false;
    if (cid === currentId) {
      matches = true;
    } else if (groupKey) {
      matches = cGroup === groupKey;
    } else if (colorKey && nameKey && categoryKey) {
      matches = cName === nameKey && cCategory === categoryKey && Boolean(cColor);
    }

    if (!matches) return;

    const existing = byId.get(cid);
    if (!existing) {
      byId.set(cid, candidate);
    } else {
      byId.set(cid, {
        ...existing,
        ...candidate,
        image:
          Array.isArray(candidate.image) && candidate.image.length > 0
            ? candidate.image
            : existing.image,
      });
    }
  };

  addCandidate(product);
  if (Array.isArray(product.colorVariants)) {
    product.colorVariants.forEach(addCandidate);
  }
  if (Array.isArray(allProducts)) {
    allProducts.forEach(addCandidate);
  }

  return Array.from(byId.values()).sort((a, b) => {
    const aColor = String(a.color || a.code || "").trim().toLowerCase();
    const bColor = String(b.color || b.code || "").trim().toLowerCase();
    if (aColor !== bColor) return aColor.localeCompare(bColor);
    return String(a._id || a.id || "").localeCompare(String(b._id || b.id || ""));
  });
}
