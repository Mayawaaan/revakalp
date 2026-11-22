import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import useStore from "../../store/store";
import SectionHeading from "../ui/SectionHeading";
import ProductGrid from "../ui/ProductGrid";
import EditorialButton from "../ui/EditorialButton";
import { matchesCategory } from "../../config/storefrontCategories";

const TABS = [
  { id: "all", label: "All Highlights" },
  { id: "saree", label: "Sarees" },
  { id: "lehenga", label: "Lehengas" },
  { id: "kurta", label: "Kurta & Jodhpuri" },
  { id: "printed-tees", label: "Printed Tees" },
];

export default function TrendingProducts() {
  const { products, loading, error, fetchProducts } = useStore();
  const [activeTab, setActiveTab] = useState("all");

  const inStockProducts = useMemo(() => {
    const list = (products || []).filter((p) => {
      const stock = Number(p?.stock);
      return Number.isFinite(stock) && stock > 0;
    });

    // Prioritize bestsellers first, then newest
    return [...list].sort((a, b) => {
      if (Boolean(a.bestseller) !== Boolean(b.bestseller)) {
        return a.bestseller ? -1 : 1;
      }
      return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
    });
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeTab === "all") return inStockProducts.slice(0, 8);
    if (activeTab === "kurta") {
      return inStockProducts
        .filter((p) => matchesCategory(p, "kurta") || matchesCategory(p, "jodhpuri"))
        .slice(0, 8);
    }
    return inStockProducts.filter((p) => matchesCategory(p, activeTab)).slice(0, 8);
  }, [inStockProducts, activeTab]);

  return (
    <section
      aria-label="Trending This Season"
      className="py-16 sm:py-24 bg-[#F7F1E5] border-b border-[#38131E]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Customer Favorites"
            title="Trending"
            accentWord="This Season"
            subtitle="Live inventory curated from our Indore storefront catalog."
            align="left"
          />
          <Link
            to="/shop/all/all"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1 self-start lg:self-auto"
          >
            View All Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter trending products by category"
          className="flex flex-wrap gap-2 mb-10"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`rk-chip ${active ? "rk-chip-active" : ""}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {error && !loading && inStockProducts.length === 0 ? (
          <div className="rk-surface-card p-10 text-center max-w-xl mx-auto">
            <h3 className="font-serif text-2xl text-[#38131E] mb-2">
              Catalog temporarily unavailable
            </h3>
            <p className="text-sm text-[#1A1718]/70 mb-6">
              Unable to load live inventory right now ({error}).
            </p>
            <EditorialButton onClick={() => fetchProducts()} variant="primary">
              <RefreshCw className="w-4 h-4" /> Retry Loading
            </EditorialButton>
          </div>
        ) : (
          <ProductGrid
            products={visibleProducts}
            loading={loading}
            emptyProps={{
              title:
                activeTab === "all"
                  ? "No active items in stock"
                  : "No items in this category yet",
              description:
                activeTab === "all"
                  ? "Check back shortly as our Indore retail inventory updates."
                  : "There are currently no in-stock pieces listed under this category. Explore our full catalog instead.",
              actionLabel: activeTab === "all" ? "Browse Shop" : "View All Available",
              onAction: activeTab === "all" ? undefined : () => setActiveTab("all"),
              actionTo: activeTab === "all" ? "/shop" : undefined,
            }}
          />
        )}
      </div>
    </section>
  );
}
