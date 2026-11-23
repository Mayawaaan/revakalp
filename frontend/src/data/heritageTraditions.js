import { getAvailableStock } from "../config/storefrontCategories";
import { loadAllHeritageTraditions } from "../utils/heritageMarkdown";

/**
 * Complete 29-state regional textile archive parsed directly from Markdown dossiers
 * in src/content/heritage/states/*.md. Grounded in established Indian textile scholarship
 * without fabricating GI registries, workshop ownership, or unverified provenance.
 */
export const HERITAGE_TRADITIONS = loadAllHeritageTraditions();

export const FEATURED_HERITAGE_TRADITIONS = HERITAGE_TRADITIONS.filter(
  (t) => t.featured
);

export const HERITAGE_ZONES = [
  "All",
  "North",
  "Central",
  "West",
  "East",
  "Northeast",
  "South",
];

export function getTraditionBySlug(slug = "") {
  const normalized = String(slug).trim().toLowerCase();
  if (!normalized) return null;
  return (
    HERITAGE_TRADITIONS.find(
      (t) =>
        t.slug === normalized ||
        t.state.toLowerCase() === normalized ||
        t.catalogSlugs.includes(normalized)
    ) || null
  );
}

export function getTraditionByState(stateName = "") {
  const normalized = String(stateName).trim().toLowerCase();
  if (!normalized) return null;
  return (
    HERITAGE_TRADITIONS.find(
      (t) =>
        t.state.toLowerCase() === normalized ||
        t.mapStateName.toLowerCase() === normalized
    ) || null
  );
}

export function matchTraditionProducts(products = [], tradition) {
  if (!tradition || !Array.isArray(products)) return [];
  const needles = [
    tradition.name,
    tradition.state,
    ...tradition.catalogSlugs,
  ]
    .filter(Boolean)
    .map((s) => s.toLowerCase());

  return products.filter((product) => {
    if (getAvailableStock(product) <= 0) return false;
    const hay = [
      product.name,
      product.type,
      product.subCategory,
      product.category,
      product.print,
      product.state,
      product.description,
      product.specs?.weave,
      product.specs?.provenance,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return needles.some((needle) => hay.includes(needle));
  });
}

export function findTraditionForProduct(product) {
  if (!product) return null;
  const hay = [
    product.name,
    product.type,
    product.subCategory,
    product.print,
    product.state,
    product.specs?.weave,
    product.specs?.provenance,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    HERITAGE_TRADITIONS.find((trad) =>
      [trad.name, trad.state, ...trad.catalogSlugs].some((needle) =>
        hay.includes(needle.toLowerCase())
      )
    ) || null
  );
}
