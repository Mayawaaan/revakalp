import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import useStore from "../../store/store";

const ManageProducts = () => {
  const {
    adminProducts,
    fetchAdminProducts,
    addAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    deleteAllAdminProducts,
    showToast,
  } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  /* ================= FORM STATE (ALL FIELDS) ================= */
  const [form, setForm] = useState({
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
    sizes: "",
    stock: "",
    date: "",
    bestseller: false,
    print: "",
    exclusivity: false,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  /* ================= MODAL ================= */

  const openCreate = () => {
    setEditing(false);
    setActiveProduct(null);
    setForm({
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
      sizes: "",
      stock: "",
      date: "",
      bestseller: false,
      print: "",
      exclusivity: false,
    });
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
      price: p.price || "",
      discount: p.discount || "",
      category: p.category || "",
      subCategory: p.subCategory || "",
      type: p.type || "",
      gender: p.gender || "Women",
      state: p.state || "",
      hasSizes: Boolean(p.hasSizes),
      sizes: Array.isArray(p.sizes) ? p.sizes : [],
      stock: p.stock || "",
      bestseller: Boolean(p.bestseller),
      print: p.print || "",
      exclusivity: Boolean(p.exclusivity),
    });
    setExistingImages(p.images || []);
    setImages([]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveProduct(null);
    setImages([]);
    setExistingImages([]);
  };

  /* ================= SUBMIT ================= */

  const submitForm = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount),
      stock: Number(form.stock),
      hasSizes: String(form.hasSizes),
      sizes: form.hasSizes
        ? (Array.isArray(form.sizes)
            ? form.sizes
            : form.sizes.split(",").map((s) => s.trim()))
        : [],
      bestseller: String(form.bestseller),
      exclusivity: String(form.exclusivity),
      images,
      existingImages,
    };

    try {
      if (editing) {
        await updateAdminProduct(activeProduct, payload);
        showToast("Product updated", "success");
      } else {
        await addAdminProduct(payload);
        showToast("Product created", "success");
      }
      closeModal();
    } catch (err){
      showToast("Failed to save product", "error",err);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    await deleteAdminProduct(id);
    showToast("Product deleted", "success");
  };

  const deleteAllProducts = async () => {
    if (window.confirm("Are you sure you want to delete all products? This action cannot be undone.")) {
      try {
        await deleteAllAdminProducts();
        showToast("All products deleted", "success");
      } catch (err) {
        showToast("Failed to delete all products", "error", err);
      }
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">Catalog</p>
          <h1 className="text-3xl font-serif text-[#38131E]">Products</h1>
          <p className="text-[#5C4E52] text-sm mt-1">Manage your catalog and inventory</p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2.5 rounded-full text-sm font-medium border border-[#D4AF63]/40 shadow-sm transition-all duration-200"
          >
            <Plus size={15} /> Add Product
          </button>
          <button
            onClick={deleteAllProducts}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
          >
            <Trash2 size={15} /> Delete All
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl overflow-x-auto shadow-sm">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F1E5]/70 border-b border-[#38131E]/12">
              <tr>
                <th className="p-4 text-left text-xs uppercase tracking-wider text-[#38131E] font-semibold">Product</th>
                <th className="p-3 text-xs uppercase tracking-wider text-[#38131E] font-semibold">Price</th>
                <th className="p-4 text-xs uppercase tracking-wider text-[#38131E] font-semibold">Category</th>
                <th className="p-4 text-xs uppercase tracking-wider text-[#38131E] font-semibold">Sizes</th>
                <th className="p-4 text-xs uppercase tracking-wider text-[#38131E] font-semibold">Status</th>
                <th className="p-4 text-right text-xs uppercase tracking-wider text-[#38131E] font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {adminProducts.map((p) => (
                <tr key={p._id} className="border-t border-[#38131E]/10 hover:bg-[#F7F1E5]/40 transition-colors">
                  <td className="p-4 flex gap-3">
                    {p.image?.[0] ? (
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-xl shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#F7F1E5] flex items-center justify-center rounded-xl border border-[#38131E]/15">
                        <ImageIcon size={16} className="text-[#7A6A6E]" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#1A1718]">{p.name}</p>
                      <p className="text-xs text-[#7A6A6E]">
                        {p.type} · {p.gender}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 font-semibold">
                    {
                    Math.round(p.discountedPrice) ? (
                      <div>
                        <span className="text-[#38131E]">₹{Math.round(p.discountedPrice)}</span>
                        <span className="ml-2 text-[#7A6A6E] line-through text-xs">₹{p.price}</span>
                      </div>
                    ) : (
                      <span className="text-[#1A1718]">₹{p.price}</span>
                    )}
                  </td>

                  <td className="p-4 text-[#5C4E52] text-sm">
                    {p.category} / {p.subCategory}
                  </td>

                  <td className="p-4">
                    {p.hasSizes ? (
                      p.sizes?.length > 0 ? (
                        p.sizes.map((s) => (
                          <span
                            key={s}
                            className="mr-1 px-2 py-0.5 bg-[#F7F1E5] border border-[#38131E]/15 text-[#38131E] text-xs rounded-full"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#7A6A6E]">—</span>
                      )
                    ) : (
                      <span className="text-xs text-[#7A6A6E] italic">No sizes</span>
                    )}
                  </td>

                  <td className="p-4">
                    {p.bestseller && (
                      <span className="inline-flex items-center gap-1 text-xs bg-[#F7F1E5] text-[#38131E] border border-[#D4AF63]/50 px-2 py-1 rounded-full">
                        <Star size={12} className="text-[#9A7A3A]" /> Bestseller
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="text-[#38131E] hover:text-[#9A7A3A] transition"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => removeProduct(p._id)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          {adminProducts.map((p) => (
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
                <div className="flex-1">
                  <p className="font-medium text-[#1A1718]">{p.name}</p>
                  <p className="text-xs text-[#7A6A6E]">
                    {p.type} · {p.gender}
                  </p>
                  <div className="mt-2">
                    {
                    Math.round(p.discountedPrice) ? (
                      <div>
                        <span className="text-[#38131E] font-semibold">₹{Math.round(p.discountedPrice)}</span>
                        <span className="ml-2 text-[#7A6A6E] line-through text-xs">₹{p.price}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-[#1A1718]">₹{p.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => openEdit(p)} className="text-[#38131E] hover:text-[#9A7A3A] transition">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => removeProduct(p._id)} className="text-red-600 hover:text-red-700 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="font-semibold text-[#38131E]">Sizes:</span>
                {p.sizes?.map((s) => (
                  <span
                    key={s}
                    className="mr-1 px-2 py-0.5 bg-[#F7F1E5] border border-[#38131E]/15 text-[#38131E] text-xs rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-2">
                {p.bestseller && (
                  <span className="inline-flex items-center gap-1 text-xs bg-[#F7F1E5] text-[#38131E] border border-[#D4AF63]/50 px-2 py-1 rounded-full">
                    <Star size={12} className="text-[#9A7A3A]" /> Bestseller
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#1A1718]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-full overflow-y-auto p-6 relative shadow-2xl border border-[#38131E]/15">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#7A6A6E] hover:text-[#38131E] transition"
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
                placeholder="Product Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="md:col-span-2 border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <textarea
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="md:col-span-2 border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <input
                type="number"
                placeholder="Discount %"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <input
                placeholder="Category (e.g. Saree, Lehenga, Indo-Western, Printed Tees)"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <input
                placeholder="Sub Category"
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <input
                placeholder="Type (e.g. Banarasi, Fusion, Bridal)"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2.5 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
              >
                <option>Women</option>
                <option>Men</option>
                <option>Unisex</option>
              </select>

              <input
                placeholder="State / Region"
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

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

              {/* Sizes input — only shown when hasSizes is on */}
              {form.hasSizes && (
                <input
                  placeholder="Sizes (comma separated, e.g. S, M, L, XL)"
                  value={Array.isArray(form.sizes) ? form.sizes.join(", ") : ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sizes: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="md:col-span-2 border border-[#38131E]/20 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF63] text-sm text-[#1A1718]"
                />
              )}



              <input
                placeholder="Print Type"
                value={form.print}
                onChange={(e) =>
                  setForm({ ...form, print: e.target.value })
                }
                className="border border-[#38131E]/20 px-3 py-2 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
              />

              <label className="flex items-center gap-2 text-sm text-[#1A1718]">
                <input
                  type="checkbox"
                  checked={form.bestseller}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bestseller: e.target.checked,
                    })
                  }
                  className="accent-[#38131E]"
                />
                Bestseller
              </label>

              <label className="flex items-center gap-2 text-sm text-[#1A1718]">
                <input
                  type="checkbox"
                  checked={form.exclusivity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      exclusivity: e.target.checked,
                    })
                  }
                  className="accent-[#38131E]"
                />
                Exclusive
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImages(Array.from(e.target.files))
                }
                className="md:col-span-2 text-sm text-[#38131E]"
              />

              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="text-sm text-[#5C4E52] hover:text-[#38131E] transition px-4 py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-6 py-2 rounded-full text-sm font-medium border border-[#D4AF63]/40 shadow-sm transition-all duration-200"
                >
                  {editing ? "Update Product" : "Create Product"}
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
