import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Star,
  Image as ImageIcon,
  Search,
  Upload,
} from "lucide-react";
import useStore from "../../store/store";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "",
  subCategory: "",
  type: "",
  gender: "Women",
  state: "",
  hasSizes: false,
  sizes: [],
  stock: "",
  bestseller: false,
  print: "",
  exclusivity: false,
  specsFabric: "",
  specsWeave: "",
  specsLength: "",
  specsCare: "",
  specsProvenance: "",
};

const ManageProducts = () => {
  const {
    adminProducts,
    fetchAdminProducts,
    fetchProducts,
    addAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    deleteAllAdminProducts,
    showToast,
  } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  const categories = useMemo(() => {
    const set = new Set(
      (adminProducts || []).map((p) => p.category).filter(Boolean)
    );
    return ["All", ...Array.from(set).sort()];
  }, [adminProducts]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (adminProducts || []).filter((p) => {
      if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        (p.name || "").toLowerCase().includes(q) ||
        (p.code || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.type || "").toLowerCase().includes(q) ||
        (p.state || "").toLowerCase().includes(q)
      );
    });
  }, [adminProducts, categoryFilter, search]);

  const openCreate = () => {
    setEditing(false);
    setActiveProduct(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setExistingImages([]);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(true);
    setActiveProduct(p);
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price ?? "",
      discount: p.discount ?? "",
      category: p.category || "",
      subCategory: p.subCategory || "",
      type: p.type || "",
      gender: p.gender || "Women",
      state: p.state || "",
      hasSizes: Boolean(p.hasSizes),
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      stock: p.stock ?? "",
      bestseller: Boolean(p.bestseller),
      print: p.print || "",
      exclusivity: Boolean(p.exclusivity),
      specsFabric: p.specs?.fabric || "",
      specsWeave: p.specs?.weave || "",
      specsLength: p.specs?.length || "",
      specsCare: p.specs?.care || "",
      specsProvenance: p.specs?.provenance || "",
    });
    // Preserve product images accurately (`product.image` array on backend)
    setExistingImages(
      Array.isArray(p.image) ? p.image : Array.isArray(p.images) ? p.images : []
    );
    setImages([]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveProduct(null);
    setImages([]);
    setExistingImages([]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!editing && images.length === 0) {
      showToast("Please upload at least one product image", "error");
      return;
    }

    const specs = {
      fabric: form.specsFabric.trim(),
      weave: form.specsWeave.trim(),
      length: form.specsLength.trim(),
      care: form.specsCare.trim(),
      provenance: form.specsProvenance.trim(),
    };

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discount: form.discount === "" ? 0 : Number(form.discount),
      category: form.category.trim(),
      subCategory: form.subCategory.trim(),
      type: form.type.trim(),
      gender: form.gender,
      state: form.state.trim(),
      stock: Number(form.stock),
      hasSizes: String(form.hasSizes),
      sizes: form.hasSizes
        ? Array.isArray(form.sizes)
          ? form.sizes
          : String(form.sizes)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
        : [],
      bestseller: String(form.bestseller),
      print: form.print.trim(),
      exclusivity: String(form.exclusivity),
      specs: JSON.stringify(specs),
      images,
      ...(editing ? { existingImages } : {}),
    };

    setSaving(true);
    try {
      if (editing) {
        await updateAdminProduct(activeProduct, payload);
        showToast("Product updated", "success");
      } else {
        await addAdminProduct(payload);
        showToast("Product created", "success");
      }
      closeModal();
      fetchProducts?.();
    } catch (err) {
      showToast(err?.message || "Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await deleteAdminProduct(id);
      showToast("Product deleted", "success");
      fetchProducts?.();
    } catch (err) {
      showToast(err?.message || "Failed to delete product", "error");
    }
  };

  const deleteAllProducts = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all products? This action cannot be undone."
      )
    ) {
      try {
        await deleteAllAdminProducts();
        showToast("All products deleted", "success");
        fetchProducts?.();
      } catch (err) {
        showToast(err?.message || "Failed to delete all products", "error");
      }
    }
  };

  const inputCls =
    "border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60 bg-white";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">
            Catalog
          </p>
          <h1 className="text-3xl font-serif text-[#38131E]">Products</h1>
          <p className="text-[#5C4E52] text-sm mt-1">
            Create, edit, upload imagery, and manage product inventory ({adminProducts.length} items)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2.5 rounded-full text-sm font-medium border border-[#D4AF63]/40 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Plus size={15} /> Add Product
          </button>
          <button
            type="button"
            onClick={deleteAllProducts}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
          >
            <Trash2 size={15} /> Delete All
          </button>
        </div>
      </div>

      {/* SEARCH & CATEGORY FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6A6E]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU code, weave, or state…"
            className="w-full pl-10 pr-4 py-2.5 border border-[#38131E]/20 rounded-xl text-sm text-[#1A1718] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-[#38131E]/20 rounded-xl px-3.5 py-2.5 text-sm bg-white text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl overflow-x-auto shadow-sm">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F1E5]/70 border-b border-[#38131E]/12">
              <tr>
                <th className="p-4 text-left text-xs uppercase tracking-wider text-[#38131E] font-semibold">
                  Product
                </th>
                <th className="p-3 text-left text-xs uppercase tracking-wider text-[#38131E] font-semibold">
                  Price
                </th>
                <th className="p-4 text-left text-xs uppercase tracking-wider text-[#38131E] font-semibold">
                  Category
                </th>
                <th className="p-4 text-left text-xs uppercase tracking-wider text-[#38131E] font-semibold">
                  Stock
                </th>
                <th className="p-4 text-left text-xs uppercase tracking-wider text-[#38131E] font-semibold">
                  Badges
                </th>
                <th className="p-4 text-right text-xs uppercase tracking-wider text-[#38131E] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => {
                const avail = Math.max(
                  0,
                  (Number(p.stock) || 0) - (Number(p.reserved) || 0)
                );
                return (
                  <tr
                    key={p._id}
                    className="border-t border-[#38131E]/10 hover:bg-[#F7F1E5]/40 transition-colors"
                  >
                    <td className="p-4 flex gap-3">
                      {p.image?.[0] ? (
                        <img
                          src={p.image[0]}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-xl shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#F7F1E5] flex items-center justify-center rounded-xl border border-[#38131E]/15 shrink-0">
                          <ImageIcon size={16} className="text-[#7A6A6E]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#1A1718]">{p.name}</p>
                        <p className="text-xs text-[#7A6A6E]">
                          {p.code ? `${p.code} · ` : ""}
                          {p.type} · {p.gender}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 font-semibold">
                      {Math.round(p.discountedPrice) ? (
                        <div>
                          <span className="text-[#38131E]">
                            ₹{Math.round(p.discountedPrice)}
                          </span>
                          <span className="ml-2 text-[#7A6A6E] line-through text-xs">
                            ₹{p.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#1A1718]">₹{p.price}</span>
                      )}
                    </td>

                    <td className="p-4 text-[#5C4E52] text-sm">
                      {p.category} / {p.subCategory}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          avail <= 0
                            ? "bg-red-50 text-red-700 border-red-200"
                            : avail === 1
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {avail} avail
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.bestseller && (
                          <span className="inline-flex items-center gap-1 text-xs bg-[#F7F1E5] text-[#38131E] border border-[#D4AF63]/50 px-2 py-0.5 rounded-full">
                            <Star size={11} className="text-[#9A7A3A]" /> Bestseller
                          </span>
                        )}
                        {p.hasSizes && p.sizes?.length > 0 && (
                          <span className="text-[11px] text-[#5C4E52]">
                            {p.sizes.join(", ")}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right space-x-3">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="text-[#38131E] hover:text-[#9A7A3A] transition cursor-pointer"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(p._id)}
                        className="text-red-600 hover:text-red-700 transition cursor-pointer"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-[#7A6A6E]">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {filteredProducts.map((p) => (
            <div key={p._id} className="border-t border-[#38131E]/10 p-4">
              <div className="flex gap-4">
                {p.image?.[0] ? (
                  <img
                    src={p.image[0]}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#F7F1E5] flex items-center justify-center rounded-xl border border-[#38131E]/15">
                    <ImageIcon size={24} className="text-[#7A6A6E]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1A1718] truncate">{p.name}</p>
                  <p className="text-xs text-[#7A6A6E]">
                    {p.type} · {p.gender} · Stock: {p.stock}
                  </p>
                  <div className="mt-2">
                    {Math.round(p.discountedPrice) ? (
                      <div>
                        <span className="text-[#38131E] font-semibold">
                          ₹{Math.round(p.discountedPrice)}
                        </span>
                        <span className="ml-2 text-[#7A6A6E] line-through text-xs">
                          ₹{p.price}
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold text-[#1A1718]">₹{p.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    className="text-[#38131E] hover:text-[#9A7A3A] transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(p._id)}
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#1A1718]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 relative shadow-2xl border border-[#38131E]/15">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#7A6A6E] hover:text-[#38131E] transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="font-serif text-xl text-[#38131E] mb-5">
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            <form
              onSubmit={submitForm}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                required
                placeholder="Product Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`md:col-span-2 ${inputCls}`}
              />

              <textarea
                required
                rows={3}
                placeholder="Description *"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={`md:col-span-2 ${inputCls}`}
              />

              <input
                required
                type="number"
                min={1}
                placeholder="Price (₹) *"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputCls}
              />

              <input
                type="number"
                min={0}
                max={95}
                placeholder="Discount %"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className={inputCls}
              />

              <input
                required
                type="number"
                min={0}
                placeholder="Stock Qty *"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className={inputCls}
              />

              <input
                required
                placeholder="Category (e.g. saree, lehenga, indo-western) *"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              />

              <input
                required
                placeholder="Sub Category / Fabric *"
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                className={inputCls}
              />

              <input
                required
                placeholder="Type (e.g. Maheshwari, Bridal, Printed) *"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputCls}
              />

              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className={inputCls}
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Unisex">Unisex</option>
              </select>

              <input
                required
                placeholder="State / Region (e.g. Madhya Pradesh) *"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className={inputCls}
              />

              <input
                placeholder="Print / Pattern Style"
                value={form.print}
                onChange={(e) => setForm({ ...form, print: e.target.value })}
                className={inputCls}
              />

              {/* Fabric & Care Specs */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FBF7EE] border border-[#38131E]/12">
                <p className="sm:col-span-2 text-[11px] uppercase tracking-[0.18em] text-[#38131E]/75 font-semibold">
                  Fabric &amp; Care Specifications (Optional)
                </p>
                <input
                  placeholder="Fabric (e.g. Silk-Cotton Blend)"
                  value={form.specsFabric}
                  onChange={(e) =>
                    setForm({ ...form, specsFabric: e.target.value })
                  }
                  className={inputCls}
                />
                <input
                  placeholder="Weave & Pattern"
                  value={form.specsWeave}
                  onChange={(e) =>
                    setForm({ ...form, specsWeave: e.target.value })
                  }
                  className={inputCls}
                />
                <input
                  placeholder="Length / Dimensions"
                  value={form.specsLength}
                  onChange={(e) =>
                    setForm({ ...form, specsLength: e.target.value })
                  }
                  className={inputCls}
                />
                <input
                  placeholder="Care Instructions (e.g. Dry Clean Only)"
                  value={form.specsCare}
                  onChange={(e) => setForm({ ...form, specsCare: e.target.value })}
                  className={inputCls}
                />
                <input
                  placeholder="Origin / Heritage Note"
                  value={form.specsProvenance}
                  onChange={(e) =>
                    setForm({ ...form, specsProvenance: e.target.value })
                  }
                  className={`sm:col-span-2 ${inputCls}`}
                />
              </div>

              {/* hasSizes toggle */}
              <label className="md:col-span-2 flex items-center gap-3 p-3 border border-[#38131E]/15 rounded-xl bg-[#F7F1E5]/60 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.hasSizes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hasSizes: e.target.checked,
                        sizes: e.target.checked ? form.sizes : [],
                      })
                    }
                  />
                  <div
                    className={`w-10 h-5 rounded-full transition-colors ${
                      form.hasSizes ? "bg-[#38131E]" : "bg-[#38131E]/20"
                    }`}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.hasSizes ? "translate-x-5" : ""
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1718]">
                    {form.hasSizes ? "Sizes Enabled" : "Sizes Disabled"}
                  </p>
                  <p className="text-xs text-[#5C4E52]">
                    {form.hasSizes
                      ? "Customers must pick a size before adding to cart"
                      : "This product has no size variants"}
                  </p>
                </div>
              </label>

              {form.hasSizes && (
                <input
                  placeholder="Sizes (comma separated, e.g. S, M, L, XL)"
                  value={Array.isArray(form.sizes) ? form.sizes.join(", ") : form.sizes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sizes: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className={`md:col-span-2 ${inputCls}`}
                />
              )}

              <div className="md:col-span-2 flex flex-wrap gap-6 py-1">
                <label className="flex items-center gap-2 text-sm text-[#1A1718] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.bestseller}
                    onChange={(e) =>
                      setForm({ ...form, bestseller: e.target.checked })
                    }
                    className="accent-[#38131E]"
                  />
                  Bestseller
                </label>

                <label className="flex items-center gap-2 text-sm text-[#1A1718] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.exclusivity}
                    onChange={(e) =>
                      setForm({ ...form, exclusivity: e.target.checked })
                    }
                    className="accent-[#38131E]"
                  />
                  Exclusive
                </label>
              </div>

              {/* Integrated Product Image Manager */}
              <div className="md:col-span-2 space-y-3 p-3.5 rounded-xl bg-[#FBF7EE] border border-[#38131E]/12">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#38131E]/75 font-semibold">
                  Product Imagery
                </p>

                {existingImages.length > 0 && (
                  <div className="flex flex-wrap gap-2.5">
                    {existingImages.map((url) => (
                      <div key={url} className="relative group w-20 h-24">
                        <img
                          src={url}
                          alt="Existing product"
                          className="w-full h-full object-cover rounded-lg border border-[#38131E]/15"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setExistingImages((prev) =>
                              prev.filter((item) => item !== url)
                            )
                          }
                          aria-label="Remove existing image"
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5">
                    {images.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="relative w-20 h-24">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg border border-[#D4AF63]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImages((prev) => prev.filter((_, i) => i !== idx))
                          }
                          aria-label="Remove queued upload"
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#38131E] text-[#F1D889] flex items-center justify-center text-xs shadow cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-[#38131E]/22 rounded-xl cursor-pointer hover:border-[#D4AF63] text-xs font-medium text-[#38131E] transition">
                  <Upload size={14} />
                  <span>
                    {images.length > 0
                      ? `${images.length} new image(s) selected — click to add/replace`
                      : "Upload Product Images (up to 10 files)"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setImages(Array.from(e.target.files || []))
                    }
                    className="hidden"
                  />
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-sm text-[#5C4E52] hover:text-[#38131E] transition px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-6 py-2 rounded-full text-sm font-medium border border-[#D4AF63]/40 shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving…" : editing ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
