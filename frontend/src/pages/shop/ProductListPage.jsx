import React, { useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, ShoppingBag, X } from "lucide-react";
import useStore from "../../store/store";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import PageHero from "../../components/globalComponents/PageHero";
import FilterPanel from "../../components/ui/FilterPanel";
import FilterDrawer from "../../components/shop/FilterDrawer";
import SortMenu from "../../components/shop/SortMenu";
import ProductGrid from "../../components/ui/ProductGrid";
import EditorialButton from "../../components/ui/EditorialButton";
import {
  STOREFRONT_CATEGORIES,
  matchesCategory,
  matchesTypeOrKeyword,
  getEffectivePrice,
  normalizeSlug,
} from "../../config/storefrontCategories";

const ProductListPage = () => {
  const { category = "all", type = "all" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { products, loading, currency, search, setSearch } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
  const { availableSubCategories, availableStates, priceCeiling } = useMemo(() => {
    const subs = new Set();
    const states = new Set();
    let maxP = 0;

    for (const p of products || []) {
      if (p?.subCategory) subs.add(p.subCategory.trim());
      if (p?.state) states.add(p.state.trim());
      const ep = getEffectivePrice(p);
      if (ep > maxP) maxP = ep;
    }
    const roundedCeiling = Math.max(5000, Math.ceil(maxP / 1000) * 1000);
    return {
      availableSubCategories: Array.from(subs).sort(),
      availableStates: Array.from(states).sort(),
      priceCeiling: roundedCeiling,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = activeQuery.toLowerCase();

    const list = routeScopedProducts.filter((p) => {
      if (inStockOnly && !(Number(p?.stock) > 0)) return false;

      if (q) {
        const hay = [
          p?.name,
          p?.description,
          p?.category,
          p?.subCategory,
          p?.type,
          p?.print,
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
    maxPrice,
    sortBy,
  ]);

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

  const normalizedCategorySlug = normalizeSlug(category);
  const categoryOptions = [
    { id: "all", label: "All" },
    ...STOREFRONT_CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
  ];

  const hasActiveChips =
    Boolean(activeQuery) ||
    selectedSubCategories.length > 0 ||
    selectedStates.length > 0 ||
    maxPrice > 0 ||
    !inStockOnly;

  const filterPanelProps = {
    categories: categoryOptions,
    subCategories: availableSubCategories,
    states: availableStates,
    selectedCategory:
      categoryOptions.find((c) => c.id === normalizedCategorySlug)?.id ||
      (normalizedCategorySlug === "lehengas" ? "lehenga" : "all"),
    selectedSubCategories,
    selectedStates,
    maxPrice,
    priceCeiling,
    inStockOnly,
    onCategoryChange: handleCategorySwitch,
    onToggleSubCategory: toggleSubCategory,
    onToggleState: toggleState,
    onMaxPriceChange: (val) => updateParam("maxPrice", val > 0 ? val : ""),
    onInStockChange: (val) => updateParam("inStock", val ? "" : "false"),
    onClearAll: clearAllFilters,
    currency: currency || "₹",
  };

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label={category !== "all" ? decodeURIComponent(category).replace(/-/g, " ") : "Catalog"}
        title={pageTitle}
        subtitle="Curated apparel and occasionwear from our Indore retail inventory."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrums />

        {/* Toolbar */}
        <div className="mt-4 mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#38131E]/12">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 min-h-[42px] px-4 py-2 rounded-full bg-white border border-[#38131E]/25 text-xs uppercase tracking-[0.16em] font-medium text-[#38131E] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#38131E]/80 font-medium">
              <ShoppingBag className="w-4 h-4 text-[#38131E]" />
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
          <div className="flex flex-wrap items-center gap-2 mb-6">
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

        {/* Main Layout: Desktop Filter Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
          <aside className="hidden lg:block sticky top-28 rk-surface-card p-6">
            <FilterPanel {...filterPanelProps} />
          </aside>

          <div>
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              columnsClass="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              emptyProps={{
                title: "No matching products found",
                description:
                  routeScopedProducts.length === 0
                    ? "There are currently no products listed in this category. Explore our full available catalog below."
                    : "Try clearing one or more active filters to view available pieces.",
                actionLabel: hasActiveChips ? "Reset Filters" : "View All Catalog",
                onAction: hasActiveChips ? clearAllFilters : undefined,
                actionTo: hasActiveChips ? undefined : "/shop/all/all",
                secondaryAction:
                  category !== "all" ? (
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
