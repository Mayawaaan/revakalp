import React, { useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import {
  ACTIVE_STOREFRONT_CATEGORIES,
  getProductImage,
  getEffectivePrice,
  getAvailableStock,
} from "../../config/storefrontCategories";
import { HERITAGE_TRADITIONS } from "../../data/heritageTraditions";

export default function SearchBar() {
  const { search, setSearch, showSearch, setShowSearch, products, currency } =
    useStore();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showSearch) return undefined;
    const timer = setTimeout(() => inputRef.current?.focus(), 40);
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showSearch, setShowSearch]);

  const matchingProducts = useMemo(() => {
    const list = (products || []).filter((p) => getAvailableStock(p) > 0);
    const q = (search || "").trim().toLowerCase();
    if (!q) return list.slice(0, 6);

    return list
      .filter((p) =>
        [p?.name, p?.category, p?.subCategory, p?.type, p?.print, p?.state]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [products, search]);

  const matchingTraditions = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return [];
    return HERITAGE_TRADITIONS.filter((trad) =>
      [trad.name, trad.region, ...trad.catalogSlugs].some((val) =>
        val.toLowerCase().includes(q)
      )
    );
  }, [search]);

  if (!showSearch) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = (search || "").trim();
    setShowSearch(false);
    navigate(q ? `/shop/all/all?q=${encodeURIComponent(q)}` : "/shop/all/all");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search storefront catalog"
      className="fixed inset-0 z-[90] flex items-start justify-center pt-14 sm:pt-20 px-4"
    >
      <div
        className="fixed inset-0 bg-[#1A1718]/70 backdrop-blur-xs"
        onClick={() => setShowSearch(false)}
      />

      <div className="relative w-full max-w-3xl bg-[#F7F1E5] border border-[#D4AF63]/55 rounded-[2px] shadow-2xl overflow-hidden">
        {/* Search Input Header */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-5 sm:px-7 py-4 bg-[#FBF7EE] border-b border-[#38131E]/14"
        >
          <Search className="w-5 h-5 text-[#38131E] shrink-0" />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search sarees, lehengas, Indo-Western, Maheshwari…"
            aria-label="Search products and textiles"
            className="flex-1 bg-transparent text-base sm:text-lg font-serif text-[#1A1718] placeholder-[#1A1718]/45 outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-[11px] uppercase tracking-[0.16em] text-[#38131E]/75 hover:text-[#38131E] px-2 py-1 cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSearch(false)}
            aria-label="Close search"
            className="w-10 h-10 rounded-[2px] flex items-center justify-center text-[#38131E] hover:bg-[#38131E]/8 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results & Category Shortcuts */}
        <div className="max-h-[72vh] overflow-y-auto p-5 sm:p-7 space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#38131E]/65 mb-3">
              Browse by Category
            </p>
            <div className="flex flex-wrap gap-2">
              {ACTIVE_STOREFRONT_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.allRoute}
                  onClick={() => setShowSearch(false)}
                  className="rk-chip"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Separated Editorial Heritage Matches */}
          {matchingTraditions.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#38131E]/65 mb-3">
                Textile Guides
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingTraditions.map((trad) => (
                  <Link
                    key={trad.slug}
                    to={`/heritage/${trad.slug}`}
                    onClick={() => setShowSearch(false)}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] border border-[#D4AF63]/40 hover:border-[#F1D889] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#F1D889]">
                        {trad.region}
                      </p>
                      <p className="font-serif text-lg truncate">{trad.name} Story</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#F1D889] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Live Purchasable Inventory Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#38131E]/65">
                {search.trim()
                  ? `In Store Now (${matchingProducts.length})`
                  : "Featured Pieces"}
              </p>
              <Link
                to={
                  search.trim()
                    ? `/shop/all/all?q=${encodeURIComponent(search.trim())}`
                    : "/shop/all/all"
                }
                onClick={() => setShowSearch(false)}
                className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.16em] font-medium text-[#38131E] hover:underline"
              >
                View in Shop <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {matchingProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingProducts.map((product) => {
                  const id = product._id || product.id;
                  const img = getProductImage(product);
                  const effPrice = getEffectivePrice(product);
                  return (
                    <Link
                      key={id}
                      to={`/product/${id}`}
                      onClick={() => setShowSearch(false)}
                      className="flex items-center gap-3.5 p-2.5 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/12 hover:border-[#D4AF63] transition-colors"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          className="w-14 h-16 object-cover rounded-[2px] shrink-0 bg-[#EFE6D5]"
                        />
                      ) : (
                        <div className="w-14 h-16 rounded-[2px] bg-[#38131E]/8 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/60 truncate">
                          {product.category || product.type || "Catalog"}
                        </p>
                        <p className="font-serif text-base text-[#38131E] truncate">
                          {product.name}
                        </p>
                        <p className="text-xs font-semibold text-[#1A1718]">
                          {currency || "₹"}
                          {effPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-[#1A1718]/65 py-6 text-center bg-[#FBF7EE] rounded-[2px] border border-[#38131E]/10">
                We couldn&apos;t find anything matching &ldquo;{search}&rdquo;. Try another word or browse our collections.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
