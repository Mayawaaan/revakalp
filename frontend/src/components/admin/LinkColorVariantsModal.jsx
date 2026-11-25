import React, { useEffect, useMemo, useState } from "react";
import { Check, Link2, Loader2, Plus, Search, X, Image as ImageIcon } from "lucide-react";
import AdminModal from "./AdminModal";
import { apiFetch } from "../../hooks/useApiHelper";
import useStore from "../../store/store";
import {
  PRESET_PRODUCT_COLORS,
  getProductColorVariants,
  resolveColorHex,
} from "../../utils/colorSwatches";

const LinkColorVariantsModal = ({ isOpen, onClose, initialProduct = null, onSaved }) => {
  const showToast = useStore((s) => s.showToast);

  const [allProducts, setAllProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [initialLinkedIds, setInitialLinkedIds] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    if (!isOpen) return undefined;
    let cancelled = false;

    const loadAll = async () => {
      setLoadingList(true);
      setSearch("");
      try {
        const list = await apiFetch("/api/admin/products");
        if (cancelled) return;
        const normalizedList = Array.isArray(list) ? list : list?.products || [];
        setAllProducts(normalizedList);

        if (initialProduct) {
          const initialId = String(initialProduct._id || initialProduct.id || "");
          const existingSiblings = getProductColorVariants(initialProduct, normalizedList);
          const seedProducts =
            existingSiblings.length > 0 ? existingSiblings : [initialProduct];

          const uniqueMap = new Map();
          seedProducts.forEach((p) => {
            const pid = String(p._id || p.id || "");
            if (!pid) return;
            const fullProduct =
              normalizedList.find((x) => String(x._id) === pid) || p;
            uniqueMap.set(pid, {
              productId: pid,
              product: fullProduct,
              color: fullProduct.color || "",
              colorHex: fullProduct.colorHex || "",
            });
          });

          if (initialId && !uniqueMap.has(initialId)) {
            const fullInitial =
              normalizedList.find((x) => String(x._id) === initialId) || initialProduct;
            uniqueMap.set(initialId, {
              productId: initialId,
              product: fullInitial,
              color: fullInitial.color || "",
              colorHex: fullInitial.colorHex || "",
            });
          }

          const seeded = Array.from(uniqueMap.values());
          setSelectedItems(seeded);
          setInitialLinkedIds(seeded.map((item) => item.productId));

          const initialCat = String(initialProduct.category || "").trim();
          if (initialCat) {
            const matchedCat = normalizedList.find(
              (p) => String(p.category || "").trim().toLowerCase() === initialCat.toLowerCase()
            )?.category;
            setCategoryFilter(matchedCat || initialCat);
          } else {
            setCategoryFilter("All");
          }
        } else {
          setSelectedItems([]);
          setInitialLinkedIds([]);
          setCategoryFilter("All");
        }
      } catch (err) {
        if (!cancelled) {
          showToast(err?.message || "Failed to load products", "error");
        }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [isOpen, initialProduct, showToast]);

  const categories = useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => {
      if (p?.category && String(p.category).trim()) {
        set.add(String(p.category).trim());
      }
    });
    if (categoryFilter && categoryFilter !== "All") {
      set.add(categoryFilter);
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allProducts, categoryFilter]);

  const selectedIdSet = useMemo(
    () => new Set(selectedItems.map((i) => i.productId)),
    [selectedItems]
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const catKey = categoryFilter.trim().toLowerCase();

    return allProducts.filter((p) => {
      if (categoryFilter !== "All") {
        if (String(p.category || "").trim().toLowerCase() !== catKey) {
          return false;
        }
      }
      if (!q) return true;
      const hay = [p.name, p.code, p.subCategory, p.type, p.color, p.variantGroup]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [allProducts, categoryFilter, search]);

  const toggleProduct = (product) => {
    const pid = String(product._id || product.id || "");
    if (!pid) return;
    setSelectedItems((prev) => {
      if (prev.some((item) => item.productId === pid)) {
        return prev.filter((item) => item.productId !== pid);
      }
      return [
        ...prev,
        {
          productId: pid,
          product,
          color: product.color || "",
          colorHex: product.colorHex || "",
        },
      ];
    });
  };

  const updateItemField = (productId, patch) => {
    setSelectedItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, ...patch } : item))
    );
  };

  const unlinkIds = useMemo(
    () => initialLinkedIds.filter((id) => !selectedIdSet.has(id)),
    [initialLinkedIds, selectedIdSet]
  );

  const canSave =
    !saving &&
    !loadingList &&
    (selectedItems.length >= 2 || unlinkIds.length > 0);

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    try {
      const result = await apiFetch("/api/admin/products/link-colors", {
        method: "PUT",
        body: JSON.stringify({
          groupId: initialProduct?.variantGroup || "",
          items: selectedItems.map((item) => ({
            productId: item.productId,
            color: item.color.trim(),
            colorHex: item.colorHex.trim(),
          })),
          unlinkProductIds: unlinkIds,
        }),
      });

      showToast(
        selectedItems.length >= 2
          ? `Linked ${selectedItems.length} color variants (${result.variantGroup || "grouped"})`
          : "Color links updated",
        "success"
      );
      onSaved?.();
      onClose();
    } catch (err) {
      showToast(err?.message || "Failed to save color links", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Link Color Variants"
      subtitle="Pick existing products (e.g., your Lehengas) and assign a color to each — they will show as Color Tabs on the storefront."
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5">
        {/* SECTION 1: Selected Products & Assigned Colors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#38131E] font-semibold">
              Linked Products ({selectedItems.length})
            </p>
            {selectedItems.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedItems([])}
                className="text-xs text-[#7A6A6E] hover:text-red-700 cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>

          {selectedItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#38131E]/25 bg-[#FBF7EE] p-5 text-center text-xs text-[#5C4E52]">
              Select 2 or more products below to link them as color options of the same item.
            </div>
          ) : (
            <div
              data-lenis-prevent=""
              data-lenis-prevent-wheel=""
              data-lenis-prevent-touch=""
              className="space-y-2.5 max-h-64 overflow-y-auto overscroll-contain rk-filter-scroll pr-1"
            >
              {selectedItems.map((item) => {
                const p = item.product || {};
                const swatchHex = resolveColorHex(item.color, item.colorHex);
                return (
                  <div
                    key={item.productId}
                    className="p-3 rounded-xl bg-[#FBF7EE] border border-[#38131E]/14 space-y-2.5"
                  >
                    <div className="flex items-center gap-3">
                      {p.image?.[0] ? (
                        <img
                          src={p.image[0]}
                          alt={p.name}
                          className="w-11 h-14 object-cover rounded-lg border border-[#38131E]/15 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-14 rounded-lg bg-[#F7F1E5] border border-[#38131E]/15 flex items-center justify-center shrink-0">
                          <ImageIcon size={16} className="text-[#7A6A6E]" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1718] truncate">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-[#7A6A6E]">
                          {p.code ? `${p.code} · ` : ""}
                          {p.category} · ₹{Number(p.discountedPrice || p.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="color"
                          aria-label={`Swatch color for ${p.name}`}
                          value={swatchHex}
                          onChange={(e) =>
                            updateItemField(item.productId, { colorHex: e.target.value })
                          }
                          className="w-9 h-9 p-0.5 rounded-lg border border-[#38131E]/20 bg-white cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          placeholder="Color (e.g. Crimson Red)"
                          value={item.color}
                          onChange={(e) =>
                            updateItemField(item.productId, { color: e.target.value })
                          }
                          className="w-40 sm:w-44 px-3 py-1.5 rounded-lg border border-[#38131E]/20 bg-white text-xs text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
                        />
                        <button
                          type="button"
                          onClick={() => toggleProduct(p)}
                          aria-label={`Remove ${p.name} from linked colors`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7A6A6E] hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Quick 1-click preset swatch dots */}
                    <div className="flex flex-wrap items-center gap-1.5 pl-14">
                      {PRESET_PRODUCT_COLORS.map((preset) => {
                        const active =
                          item.color.trim().toLowerCase() === preset.name.toLowerCase();
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            title={preset.name}
                            aria-label={`Set ${p.name} color to ${preset.name}`}
                            onClick={() =>
                              updateItemField(item.productId, {
                                color: preset.name,
                                colorHex: preset.hex,
                              })
                            }
                            className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                              active
                                ? "border-[#38131E] ring-2 ring-[#D4AF63] scale-110"
                                : "border-black/20 hover:scale-110"
                            }`}
                            style={{ backgroundColor: preset.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 2: Pick Existing Products */}
        <div className="space-y-3 pt-2 border-t border-[#38131E]/12">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6A6E]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, SKU code, or color…"
                className="w-full pl-9 pr-3 py-2 border border-[#38131E]/20 rounded-xl text-xs bg-white text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter products by category"
              className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-xs bg-white text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {loadingList ? (
            <div className="py-10 flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-[#38131E]">
              <Loader2 size={15} className="animate-spin" /> Loading products…
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#7A6A6E]">
              No products match this filter.
            </p>
          ) : (
            <div
              data-lenis-prevent=""
              data-lenis-prevent-wheel=""
              data-lenis-prevent-touch=""
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto overscroll-contain rk-filter-scroll pr-1"
            >
              {filteredProducts.map((p) => {
                const pid = String(p._id || p.id || "");
                const isSelected = selectedIdSet.has(pid);
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => toggleProduct(p)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-[#38131E]/8 border-[#38131E]"
                        : "bg-white border-[#38131E]/14 hover:border-[#D4AF63]"
                    }`}
                  >
                    {p.image?.[0] ? (
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-11 h-14 object-cover rounded-lg border border-[#38131E]/12 shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-14 rounded-lg bg-[#F7F1E5] border border-[#38131E]/12 flex items-center justify-center shrink-0">
                        <ImageIcon size={15} className="text-[#7A6A6E]" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#1A1718] truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-[#7A6A6E] truncate">
                        {p.code ? `${p.code} · ` : ""}
                        {p.subCategory || p.type}
                      </p>
                      {p.color && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[#F7F1E5] border border-[#38131E]/15 text-[#38131E]">
                          <span
                            className="w-2 h-2 rounded-full border border-black/20"
                            style={{
                              backgroundColor: resolveColorHex(p.color, p.colorHex),
                            }}
                          />
                          {p.color}
                        </span>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${
                        isSelected
                          ? "bg-[#38131E] text-[#F1D889]"
                          : "bg-[#F7F1E5] text-[#38131E] border border-[#38131E]/20"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check size={12} /> Linked
                        </>
                      ) : (
                        <>
                          <Plus size={12} /> Link
                        </>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#38131E]/12 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#5C4E52]">
            {selectedItems.length >= 2
              ? `${selectedItems.length} products will be linked together as color tabs.`
              : unlinkIds.length > 0
              ? `Will unlink ${unlinkIds.length} product(s) from this color group.`
              : "Select at least 2 products to link them together."}
          </p>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-[#5C4E52] hover:text-[#38131E] px-4 py-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={handleSave}
              className="rk-admin-btn inline-flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2 rounded-full text-sm font-medium border border-[#D4AF63]/40 shadow-sm cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <Link2 size={14} />
              {saving ? "Saving…" : "Save Color Links"}
            </button>
          </div>
        </div>
      </div>
    </AdminModal>
  );
};

export default LinkColorVariantsModal;
