import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import useStore from "../../store/store";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import PageHero from "../../components/globalComponents/PageHero";
import FilterPanel from "../../components/ui/FilterPanel";
import FilterDrawer from "../../components/shop/FilterDrawer";
import SortMenu from "../../components/shop/SortMenu";
import ProductGrid from "../../components/ui/ProductGrid";
import EditorialButton from "../../components/ui/EditorialButton";
import CampaignAdBanner from "../../components/campaigns/CampaignAdBanner";
import {
  ACTIVE_STOREFRONT_CATEGORIES,
  matchesCategory,
  matchesTypeOrKeyword,
  isEmptyMensCategory,
  getEffectivePrice,
  getAvailableStock,
  normalizeSlug,
} from "../../config/storefrontCategories";
import { useSeoMeta } from "../../utils/seo";
import { trackEvent } from "../../utils/analytics";
import { resolveColorHex } from "../../utils/colorSwatches";

const ProductListPage = () => {
  const { category = "all", type = "all" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { products, loading, currency, search, setSearch } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);

  useEffect(() => {
    const headerEl = document.querySelector("[data-site-header]");
    if (!headerEl) {
      setHeaderOffset(0);
      return undefined;
    }

    const updateOffset = () => {
      const nextHeight = Math.round(headerEl.getBoundingClientRect().height);
      setHeaderOffset((prev) => (prev === nextHeight ? prev : nextHeight));
    };

    updateOffset();

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateOffset);
      resizeObserver.observe(headerEl);
    }
    window.addEventListener("resize", updateOffset, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  // Read filter & sort state from URL searchParams
  const urlQuery = searchParams.get("q") || "";
  const activeQuery = (urlQuery || search || "").trim();
  const sortBy = searchParams.get("sort") || "featured";
  const maxPrice = Number(searchParams.get("maxPrice") || 0);
  const inStockOnly = searchParams.get("inStock") !== "false";

  const selectedSubCategories = useMemo(() => {
    const raw = searchParams.get("fabric") || "";
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedStates = useMemo(() => {
    const raw = searchParams.get("state") || "";
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedColors = useMemo(() => {
    const raw = searchParams.get("color") || "";
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || (Array.isArray(value) && value.length === 0)) {
      next.delete(key);
    } else {
      next.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }
    setSearchParams(next, { replace: true });
  };

  // Base category + type matching (case-insensitive & resilient to schema variations)
  const routeScopedProducts = useMemo(() => {
    return (products || []).filter((product) => {
      if (!matchesCategory(product, category)) return false;
      if (!matchesTypeOrKeyword(product, type)) return false;
      return true;
    });
  }, [products, category, type]);

  // Dynamic facet values derived strictly from real products
  const { availableSubCategories, availableStates, availableColors, priceCeiling } =
    useMemo(() => {
      const subs = new Set();
      const states = new Set();
      const colorMap = new Map();
      let maxP = 0;

      for (const p of products || []) {
        if (p?.subCategory) subs.add(p.subCategory.trim());
        if (p?.state) states.add(p.state.trim());
        if (p?.color && p.color.trim()) {
          const clean = p.color.trim();
          const key = clean.toLowerCase();
          if (!colorMap.has(key)) {
            colorMap.set(key, {
              name: clean,
              hex: resolveColorHex(clean, p.colorHex),
            });
          }
        }
        const ep = getEffectivePrice(p);
        if (ep > maxP) maxP = ep;
      }
      const roundedCeiling = Math.max(5000, Math.ceil(maxP / 1000) * 1000);
      return {
        availableSubCategories: Array.from(subs).sort(),
        availableStates: Array.from(states).sort(),
        availableColors: Array.from(colorMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
        priceCeiling: roundedCeiling,
      };
    }, [products]);

  const filteredProducts = useMemo(() => {
    const q = activeQuery.toLowerCase();

    const list = routeScopedProducts.filter((p) => {
      if (inStockOnly && getAvailableStock(p) <= 0) return false;

      if (q) {
        const hay = [
          p?.name,
          p?.description,
          p?.category,
          p?.subCategory,
          p?.type,
          p?.print,
          p?.color,
          p?.state,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (
        selectedSubCategories.length > 0 &&
        !selectedSubCategories.some(
          (s) => s.toLowerCase() === (p?.subCategory || "").trim().toLowerCase()
        )
      ) {
        return false;
      }

      if (
        selectedStates.length > 0 &&
        !selectedStates.some(
          (st) => st.toLowerCase() === (p?.state || "").trim().toLowerCase()
        )
      ) {
        return false;
      }

      if (
        selectedColors.length > 0 &&
        !selectedColors.some(
          (col) => col.toLowerCase() === (p?.color || "").trim().toLowerCase()
        )
      ) {
        return false;
      }

      if (maxPrice > 0 && getEffectivePrice(p) > maxPrice) {
        return false;
      }

      return true;
    });

    const sorted = [...list];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
        );
        break;
      case "bestsellers":
        sorted.sort((a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)));
        break;
      default:
        break;
    }

    return sorted;
  }, [
    routeScopedProducts,
    inStockOnly,
    activeQuery,
    selectedSubCategories,
    selectedStates,
    selectedColors,
    maxPrice,
    sortBy,
  ]);

  const lastListKeyRef = useRef("");
  const lastSearchKeyRef = useRef("");

  useEffect(() => {
    if (loading) return;
    const key = `${category}::${type}`;
    if (lastListKeyRef.current === key) return;
    lastListKeyRef.current = key;
    trackEvent("view_item_list", {
      category: String(category || "all"),
      value: filteredProducts.length,
    });
  }, [loading, category, type, filteredProducts.length]);

  useEffect(() => {
    if (loading || !activeQuery) return;
    const timer = setTimeout(() => {
      const key = `${category}::${activeQuery.toLowerCase()}`;
      if (lastSearchKeyRef.current === key) return;
      lastSearchKeyRef.current = key;
      // Do not forward raw search text to preserve user privacy
      trackEvent("search", {
        category: String(category || "all"),
        value: filteredProducts.length,
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [loading, activeQuery, category, filteredProducts.length]);

  const toggleSubCategory = (val) => {
    const next = selectedSubCategories.includes(val)
      ? selectedSubCategories.filter((v) => v !== val)
      : [...selectedSubCategories, val];
    updateParam("fabric", next);
  };

  const toggleState = (val) => {
    const next = selectedStates.includes(val)
      ? selectedStates.filter((v) => v !== val)
      : [...selectedStates, val];
    updateParam("state", next);
  };

  const toggleColor = (val) => {
    const next = selectedColors.includes(val)
      ? selectedColors.filter((v) => v !== val)
      : [...selectedColors, val];
    updateParam("color", next);
  };

  const clearAllFilters = () => {
    setSearch("");
    setSearchParams({}, { replace: true });
  };

  const handleCategorySwitch = (catId) => {
    const queryStr = searchParams.toString();
    const target = catId === "all" ? "/shop/all/all" : `/shop/${catId}/all`;
    navigate(queryStr ? `${target}?${queryStr}` : target);
  };

  const displayRaw = type !== "all" ? type : category === "all" ? "All Collections" : category;
  const pageTitle = decodeURIComponent(displayRaw)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  useSeoMeta({
    title: pageTitle,
    description: `Browse ${pageTitle} — live inventory from Revakalp's Indore retail boutique.`,
    canonicalPath: `/shop/${category}/${type}`,
  });

  const normalizedCategorySlug = normalizeSlug(category);
  const isMensEmpty = isEmptyMensCategory(category);
  const categoryOptions = [
    { id: "all", label: "All" },
    ...ACTIVE_STOREFRONT_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  const hasActiveChips =
    Boolean(activeQuery) ||
    selectedSubCategories.length > 0 ||
    selectedStates.length > 0 ||
    selectedColors.length > 0 ||
    maxPrice > 0 ||
    !inStockOnly;

  const filterPanelProps = {
    categories: categoryOptions,
    subCategories: availableSubCategories,
    states: availableStates,
    colors: availableColors,
    selectedCategory:
      categoryOptions.find((c) => c.id === normalizedCategorySlug)?.id ||
      (normalizedCategorySlug === "lehengas" ? "lehenga" : "all"),
    selectedSubCategories,
    selectedStates,
    selectedColors,
    maxPrice,
    priceCeiling,
    inStockOnly,
    onCategoryChange: handleCategorySwitch,
    onToggleSubCategory: toggleSubCategory,
    onToggleState: toggleState,
    onToggleColor: toggleColor,
    onMaxPriceChange: (val) => updateParam("maxPrice", val > 0 ? val : ""),
    onInStockChange: (val) => updateParam("inStock", val ? "" : "false"),
    onClearAll: clearAllFilters,
    currency: currency || "₹",
  };

  return (
    <div
      style={{ "--shop-sticky-top": `${headerOffset}px` }}
      className="bg-[#F7F1E5] min-h-screen"
    >
      <PageHero
        label={category !== "all" ? decodeURIComponent(category).replace(/-/g, " ") : "Shop"}
        title={pageTitle}
        subtitle="Available online and at our Indore store."
      />

      <CampaignAdBanner slot="shop_strip" compact />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrums />

        {/* Sticky Mobile & Desktop Filter/Sort Toolbar */}
        <div className="sticky top-[var(--shop-sticky-top,0px)] z-20 bg-[#F7F1E5]/96 backdrop-blur-md py-2.5 sm:py-3 -mx-4 px-4 sm:mx-0 sm:px-0 lg:static lg:bg-transparent mt-4 mb-5 sm:mb-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-[#38131E]/14">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/25 text-[11px] uppercase tracking-[0.18em] font-medium text-[#38131E] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <span className="text-xs sm:text-sm text-[#38131E]/85 font-medium">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "piece" : "pieces"}
            </span>
          </div>

          <SortMenu
            value={sortBy}
            onChange={(val) => updateParam("sort", val === "featured" ? "" : val)}
          />
        </div>

        {/* Active Filter Chips */}
        {hasActiveChips && (
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            {activeQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  updateParam("q", "");
                }}
                className="rk-chip rk-chip-active"
              >
                <span>Search: &ldquo;{activeQuery}&rdquo;</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {selectedSubCategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => toggleSubCategory(sub)}
                className="rk-chip rk-chip-active"
              >
                <span>{sub}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ))}
            {selectedStates.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => toggleState(st)}
                className="rk-chip rk-chip-active"
              >
                <span>{st}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ))}
            {selectedColors.map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => toggleColor(col)}
                className="rk-chip rk-chip-active"
              >
                <span>Color: {col}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ))}
            {maxPrice > 0 && (
              <button
                type="button"
                onClick={() => updateParam("maxPrice", "")}
                className="rk-chip rk-chip-active"
              >
                <span>
                  Max {currency || "₹"}
                  {maxPrice.toLocaleString("en-IN")}
                </span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {!inStockOnly && (
              <button
                type="button"
                onClick={() => updateParam("inStock", "")}
                className="rk-chip rk-chip-active"
              >
                <span>Including Out of Stock</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-medium text-[#38131E] underline px-2 py-1 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Layout: Desktop Hairline Filter Rail + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-8 lg:gap-10 items-start">
          <aside
            data-lenis-prevent=""
            data-lenis-prevent-wheel=""
            data-lenis-prevent-touch=""
            className="hidden lg:block sticky top-[calc(var(--shop-sticky-top,0px)_+_1.25rem)] max-h-[calc(100dvh_-_var(--shop-sticky-top,0px)_-_2.5rem)] overflow-y-auto overscroll-contain rk-filter-scroll bg-[#FBF7EE]/90 border border-[#38131E]/12 rounded-[2px] p-5"
          >
            <FilterPanel {...filterPanelProps} />
          </aside>

          <div>
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              columnsClass="grid-cols-2 sm:grid-cols-2 xl:grid-cols-3"
              emptyProps={{
                title: isMensEmpty
                  ? `Men's ${pageTitle} — Coming Soon`
                  : "Nothing matched your filters",
                description: isMensEmpty
                  ? "Our men's section is currently empty while we prepare new pieces. Explore our active collections in the meantime."
                  : routeScopedProducts.length === 0
                  ? "We don't have any pieces listed in this category right now. Take a look at everything else in store."
                  : "Try clearing a filter or two to see what's available.",
                actionLabel: isMensEmpty
                  ? "Explore Collections"
                  : hasActiveChips
                  ? "Clear Filters"
                  : "See Everything In Store",
                onAction: !isMensEmpty && hasActiveChips ? clearAllFilters : undefined,
                actionTo: isMensEmpty ? "/shop" : hasActiveChips ? undefined : "/shop/all/all",
                secondaryAction:
                  !isMensEmpty && category !== "all" && hasActiveChips ? (
                    <EditorialButton to="/shop/all/all" variant="secondary">
                      All Collections
                    </EditorialButton>
                  ) : null,
              }}
            />
          </div>
        </div>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={filteredProducts.length}
        {...filterPanelProps}
      />
    </div>
  );
};

export default ProductListPage;
