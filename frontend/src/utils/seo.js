import { useEffect } from "react";

/**
 * Sets document title, meta description, canonical URL, and optional JSON-LD structured data
 * safely in SPA routes without external dependencies.
 */
export function useSeoMeta({ title, description, canonicalPath, jsonLd }) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const prevTitle = document.title;
    if (title) {
      document.title = `${title} | REVAKALP`;
    }

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.getAttribute("content") || "";
    if (description) {
      metaDesc.setAttribute("content", description);
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    const origin = window.location?.origin || "";
    if (canonicalPath && origin) {
      linkCanonical.setAttribute("href", `${origin}${canonicalPath}`);
    }

    let scriptEl = null;
    if (jsonLd) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.id = "revakalp-jsonld";
      const existing = document.getElementById("revakalp-jsonld");
      if (existing) existing.remove();
      scriptEl.text = JSON.stringify(jsonLd);
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.title = prevTitle;
      if (prevDesc) metaDesc.setAttribute("content", prevDesc);
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, canonicalPath, jsonLd]);
}
