import { useEffect } from "react";

const DEFAULT_OG_IMAGE = "/branding/social/revakalp-open-graph-1200x630.png";
const DEFAULT_KEYWORDS =
  "Revakalp, Indian sarees online, Indore saree boutique, Maheshwari silk saree, Banarasi saree, Chanderi saree, bridal lehenga, Indo-Western wear, handloom sarees India";

function upsertMeta(attrName, attrValue, content) {
  if (!content) return null;
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  const prev = el.getAttribute("content") || "";
  el.setAttribute("content", content);
  return { el, prev };
}

function resolveAbsoluteUrl(origin, pathOrUrl = DEFAULT_OG_IMAGE) {
  if (!pathOrUrl) return origin ? `${origin}${DEFAULT_OG_IMAGE}` : DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (!origin) return pathOrUrl;
  return `${origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function buildOrganizationSchema(origin, settings = {}) {
  const name = settings?.storeName || "REVAKALP";
  const email = settings?.supportEmail || "contact@revakalp.com";
  const telephone = settings?.phone || "+91-91096-76562";
  const streetAddress =
    settings?.address ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar";
  const url = origin || "https://revakalp.com";
  const logo = resolveAbsoluteUrl(url, "/branding/icons/revakalp-icon-burgundy-on-ivory.svg");

  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${url}/#store`,
    name,
    url,
    logo,
    image: resolveAbsoluteUrl(url, DEFAULT_OG_IMAGE),
    description:
      "Revakalp is an Indore boutique and pan-India online storefront curated by Anjali Katare since 2014, offering regional Indian handloom sarees, bridal lehengas, Indo-Western silhouettes, and everyday printed tees.",
    foundingDate: "2014",
    founder: {
      "@type": "Person",
      name: settings?.grievanceOfficerName || "Anjali Katare",
    },
    email,
    telephone,
    priceRange: "₹₹-₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress,
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      postalCode: "452012",
      addressCountry: "IN",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:30",
        closes: "20:30",
      },
    ],
    sameAs: [
      "https://www.facebook.com/people/Revakalp/61587307439316/",
      "https://www.instagram.com/revakalp",
    ],
  };
}

export function buildWebSiteSchema(origin) {
  const url = origin || "https://revakalp.com";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: "REVAKALP",
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/shop/all/all?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFaqSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqs || []).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildBreadcrumbSchema(origin, items = []) {
  const base = origin || "https://revakalp.com";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.path ? resolveAbsoluteUrl(base, item.path) : undefined,
    })),
  };
}

/**
 * Sets document title, meta description, keywords, robots, canonical URL,
 * Open Graph / Twitter social cards, and single or graph JSON-LD structured data.
 */
export function useSeoMeta({
  title,
  description,
  canonicalPath,
  ogImage,
  ogType = "website",
  keywords,
  noindex = false,
  jsonLd,
}) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const prevTitle = document.title;
    const fullTitle = title
      ? `${title} | REVAKALP`
      : "REVAKALP — Weaving Life Into Time";
    if (title) {
      document.title = fullTitle;
    }

    const origin = window.location?.origin || "";
    const resolvedCanonical = canonicalPath
      ? resolveAbsoluteUrl(origin, canonicalPath)
      : window.location?.href || origin;
    const resolvedImage = resolveAbsoluteUrl(origin, ogImage || DEFAULT_OG_IMAGE);
    const resolvedDesc =
      description ||
      "Revakalp — Curated Indian handloom sarees, bridal lehengas, Indo-Western styles, and everyday printed tees from our Indore boutique.";

    const updates = [
      upsertMeta("name", "description", resolvedDesc),
      upsertMeta("name", "keywords", keywords || DEFAULT_KEYWORDS),
      upsertMeta(
        "name",
        "robots",
        noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
      ),
      upsertMeta("property", "og:title", fullTitle),
      upsertMeta("property", "og:description", resolvedDesc),
      upsertMeta("property", "og:type", ogType || "website"),
      upsertMeta("property", "og:site_name", "REVAKALP"),
      upsertMeta("property", "og:locale", "en_IN"),
      upsertMeta("property", "og:url", resolvedCanonical),
      upsertMeta("property", "og:image", resolvedImage),
      upsertMeta("property", "og:image:alt", `${fullTitle} — Revakalp Indore`),
      upsertMeta("name", "twitter:card", "summary_large_image"),
      upsertMeta("name", "twitter:title", fullTitle),
      upsertMeta("name", "twitter:description", resolvedDesc),
      upsertMeta("name", "twitter:image", resolvedImage),
    ].filter(Boolean);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    const prevCanonical = linkCanonical.getAttribute("href") || "";
    if (resolvedCanonical) {
      linkCanonical.setAttribute("href", resolvedCanonical);
    }

    let scriptEl = null;
    if (jsonLd) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.id = "revakalp-jsonld";
      const existing = document.getElementById("revakalp-jsonld");
      if (existing) existing.remove();
      const payload = Array.isArray(jsonLd)
        ? { "@context": "https://schema.org", "@graph": jsonLd }
        : jsonLd;
      scriptEl.text = JSON.stringify(payload);
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.title = prevTitle;
      for (const { el, prev } of updates) {
        if (prev) el.setAttribute("content", prev);
      }
      if (prevCanonical) linkCanonical.setAttribute("href", prevCanonical);
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, canonicalPath, ogImage, ogType, keywords, noindex, jsonLd]);
}
