import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import useStore from "../../store/store";
import SectionHeading from "../ui/SectionHeading";
import ProductCard from "../ui/ProductCard";
import EmptyState from "../ui/EmptyState";
import LoadingSkeleton from "../ui/LoadingSkeleton";
import EditorialButton from "../ui/EditorialButton";
import { matchesCategory, getAvailableStock } from "../../config/storefrontCategories";

const TABS = [
  { id: "all", label: "All" },
  { id: "saree", label: "Sarees" },
  { id: "lehenga", label: "Lehengas" },
  { id: "indo-western", label: "Indo-Western" },
  { id: "printed-tees", label: "Printed Tees" },
];

export default function TrendingProducts() {
  const { products, loading, error, fetchProducts } = useStore();
  const [activeTab, setActiveTab] = useState("all");
  const [scrollProgress, setScrollProgress] = useState(0);
  const railRef = useRef(null);

  const inStockProducts = useMemo(() => {
    const list = (products || []).filter((p) => getAvailableStock(p) > 0);
    return [...list].sort((a, b) => {
      if (Boolean(a.bestseller) !== Boolean(b.bestseller)) {
        return a.bestseller ? -1 : 1;
      }
      return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
    });
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (activeTab === "all") return inStockProducts.slice(0, 10);
    return inStockProducts.filter((p) => matchesCategory(p, activeTab)).slice(0, 10);
  }, [inStockProducts, activeTab]);

  const handleRailScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setScrollProgress(maxScroll > 0 ? Math.min(1, el.scrollLeft / maxScroll) : 0);
  };

  const stepRail = (direction) => {
    const el = railRef.current;
    if (!el) return;
    const delta = Math.max(280, el.clientWidth * 0.65) * direction;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Seasonal Arrivals Carousel"
      className="py-16 sm:py-24 bg-[#FBF7EE] border-b border-[#38131E]/12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Most Loved"
            title="What everyone is"
            accentWord="wearing"
            align="left"
          />

          <div className="flex items-center gap-4 self-start lg:self-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => stepRail(-1)}
                aria-label="Scroll carousel left"
                className="w-11 h-11 rounded-[2px] border border-[#38131E]/25 bg-[#F7F1E5] text-[#38131E] flex items-center justify-center hover:bg-[#38131E] hover:text-[#F1D889] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => stepRail(1)}
                aria-label="Scroll carousel right"
                className="w-11 h-11 rounded-[2px] border border-[#38131E]/25 bg-[#F7F1E5] text-[#38131E] flex items-center justify-center hover:bg-[#38131E] hover:text-[#F1D889] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/shop/all/all"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1"
            >
              Shop all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
                onClick={() => {
                  setActiveTab(tab.id);
                  setScrollProgress(0);
                  if (railRef.current) railRef.current.scrollLeft = 0;
                }}
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
              Unable to load just now
            </h3>
            <p className="text-sm text-[#1A1718]/70 mb-6">
              We&apos;re having trouble loading the collection right now. Please try again
              in a moment.
            </p>
            <EditorialButton onClick={() => fetchProducts()} variant="primary">
              <RefreshCw className="w-4 h-4" /> Try Again
            </EditorialButton>
          </div>
        ) : loading ? (
          <LoadingSkeleton count={4} />
        ) : visibleProducts.length === 0 ? (
          <EmptyState
            title={
              activeTab === "all"
                ? "New pieces arriving soon"
                : "Nothing on this shelf just yet"
            }
            description={
              activeTab === "all"
                ? "Check back shortly as fresh garments arrive in our Indore store."
                : "There aren't any available pieces in this category right now. Take a look at the rest of the store instead."
            }
            actionLabel={activeTab === "all" ? "Browse Shop" : "See Everything In Store"}
            onAction={activeTab === "all" ? undefined : () => setActiveTab("all")}
            actionTo={activeTab === "all" ? "/shop" : undefined}
          />
        ) : (
          <>
            <div
              ref={railRef}
              onScroll={handleRailScroll}
              className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            >
              {visibleProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="w-[78vw] sm:w-[295px] lg:w-[285px] shrink-0 snap-start"
                >
                  <ProductCard id={product._id || product.id} {...product} />
                </div>
              ))}
            </div>

            {/* Minimal Scroll Progress Gauge */}
            <div className="mt-6 h-[2px] w-full bg-[#38131E]/12 overflow-hidden">
              <div
                className="h-full bg-[#D4AF63] transition-all duration-200"
                style={{ width: `${Math.max(18, Math.round(scrollProgress * 100))}%` }}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
