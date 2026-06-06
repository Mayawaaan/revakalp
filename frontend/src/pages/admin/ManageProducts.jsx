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
          <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-1 font-medium">Catalog</p>
          <h1 className="text-3xl font-serif text-pink-900">Products</h1>
          <p className="text-pink-600 text-sm mt-1">Manage your catalog and inventory</p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-[#c9487c] to-[#9d2a52] hover:from-[#b53f6c] hover:to-[#7b1c3e] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-pink-200 transition-all duration-200"
          >
            <Plus size={15} /> Add Product
          </button>
          <button
            onClick={deleteAllProducts}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
          >
            <Trash2 size={15} /> Delete All
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-2xl overflow-x-auto shadow-sm">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/80 border-b border-pink-100">
              <tr>
                <th className="p-4 text-left text-xs uppercase tracking-wider text-pink-500 font-semibold">Product</th>
                <th className="p-3 text-xs uppercase tracking-wider text-pink-500 font-semibold">Price</th>
                <th className="p-4 text-xs uppercase tracking-wider text-pink-500 font-semibold">Category</th>
                <th className="p-4 text-xs uppercase tracking-wider text-pink-500 font-semibold">Sizes</th>
                <th className="p-4 text-xs uppercase tracking-wider text-pink-500 font-semibold">Status</th>
                <th className="p-4 text-right text-xs uppercase tracking-wider text-pink-500 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {adminProducts.map((p) => (
                <tr key={p._id} className="border-t border-pink-50 hover:bg-pink-50/50 transition-colors">
                  <td className="p-4 flex gap-3">
                    {p.image?.[0] ? (
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-xl shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-pink-50 flex items-center justify-center rounded-xl border border-pink-100">
                        <ImageIcon size={16} className="text-pink-300" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-pink-900">{p.name}</p>
                      <p className="text-xs text-pink-400">
                        {p.type} · {p.gender}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 font-semibold">
                    {
                    Math.round(p.discountedPrice) ? (
                      <div>
                        <span className="text-red-500">₹{Math.round(p.discountedPrice)}</span>
                        <span className="ml-2 text-gray-400 line-through text-xs">₹{p.price}</span>
                      </div>
                    ) : (
                      <span className="text-pink-900">₹{p.price}</span>
                    )}
                  </td>

                  <td className="p-4 text-pink-700 text-sm">
                    {p.category} / {p.subCategory}
                  </td>

                  <td className="p-4">
                    {p.hasSizes ? (
                      p.sizes?.length > 0 ? (
                        p.sizes.map((s) => (
                          <span
                            key={s}
                            className="mr-1 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-pink-300">—</span>
                      )
                    ) : (
                      <span className="text-xs text-pink-300 italic">No sizes</span>
                    )}
                  </td>

                  <td className="p-4">
                    {p.bestseller && (
                      <span className="inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full">
                        <Star size={12} /> Bestseller
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="text-pink-500 hover:text-pink-800 transition"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => removeProduct(p._id)}
                      className="text-red-400 hover:text-red-600 transition"
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
            <div key={p._id} className="border-t border-pink-50 p-4">
              <div className="flex gap-4">
                {p.image?.[0] ? (
                  <img
                    src={p.image[0]}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-16 h-16 bg-pink-50 flex items-center justify-center rounded-xl">
                    <ImageIcon size={24} className="text-pink-300" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-pink-900">{p.name}</p>
                  <p className="text-xs text-pink-400">
                    {p.type} · {p.gender}
                  </p>
                  <div className="mt-2">
                    {
                    Math.round(p.discountedPrice) ? (
                      <div>
                        <span className="text-red-500 font-semibold">₹{Math.round(p.discountedPrice)}</span>
                        <span className="ml-2 text-gray-400 line-through text-xs">₹{p.price}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-pink-900">₹{p.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => openEdit(p)} className="text-pink-500 hover:text-pink-800 transition">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => removeProduct(p._id)} className="text-red-400 hover:text-red-600 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="font-semibold text-pink-700">Sizes:</span>
                {p.sizes?.map((s) => (
                  <span
                    key={s}
                    className="mr-1 px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-2">
                {p.bestseller && (
                  <span className="inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-full">
                    <Star size={12} /> Bestseller
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-3xl max-h-full overflow-y-auto p-6 relative shadow-2xl border border-pink-100">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-pink-400 hover:text-pink-700 transition"
            >
              <X size={18} />
            </button>

            <h2 className="font-serif text-xl text-pink-900 mb-5">
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
                className="md:col-span-2 border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <textarea
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="md:col-span-2 border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <input
                type="number"
                placeholder="Discount %"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
                className="border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                className="border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <input
                placeholder="Sub Category"
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
                className="border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <input
                placeholder="Type (Saree / Kurta / Suit)"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
              />

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                className="border border-pink-200 px-3 py-2.5 rounded-xl text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300"
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
                className="border border-pink-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              {/* hasSizes toggle */}
              <label className="md:col-span-2 flex items-center gap-3 p-3 border border-pink-100 rounded-xl bg-pink-50/50 cursor-pointer select-none">
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
                      form.hasSizes ? "bg-[#c9487c]" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.hasSizes ? "translate-x-5" : ""
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-pink-900">
                    {form.hasSizes ? "Sizes Enabled" : "Sizes Disabled"}
                  </p>
                  <p className="text-xs text-pink-500">
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
                  className="md:col-span-2 border border-pink-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                />
              )}



              <input
                placeholder="Print Type"
                value={form.print}
                onChange={(e) =>
                  setForm({ ...form, print: e.target.value })
                }
                className="border border-pink-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              />

              <label className="flex items-center gap-2 text-sm text-pink-800">
                <input
                  type="checkbox"
                  checked={form.bestseller}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bestseller: e.target.checked,
                    })
                  }
                  className="accent-[#c9487c]"
                />
                Bestseller
              </label>

              <label className="flex items-center gap-2 text-sm text-pink-800">
                <input
                  type="checkbox"
                  checked={form.exclusivity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      exclusivity: e.target.checked,
                    })
                  }
                  className="accent-[#c9487c]"
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
                className="md:col-span-2 text-sm text-pink-700"
              />

              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="text-sm text-pink-500 hover:text-pink-800 transition px-4 py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#c9487c] to-[#9d2a52] hover:from-[#b53f6c] hover:to-[#7b1c3e] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg shadow-pink-200 transition-all duration-200"
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
