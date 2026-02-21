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
      sizes: Array.isArray(form.sizes)
  ? form.sizes
  : form.sizes.split(",").map((s) => s.trim()),
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
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-gray-500">Manage catalog and inventory</p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
            <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded"
            >
            <Plus size={16} /> Add Product
            </button>
            <button
            onClick={deleteAllProducts}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded"
            >
            <Trash2 size={16} /> Delete All
            </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-3">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4">Sizes</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {adminProducts.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-4 flex gap-3">
                    {p.image?.[0] ? (
                      <img
                        src={p.image[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
                        <ImageIcon size={16} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.type} · {p.gender}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 font-semibold">
                    {
                    Math.round(p.discountedPrice) ? (
                      <div>
                        <span className="text-red-500">₹{Math.round(p.discountedPrice)}</span>
                        <span className="ml-2 text-gray-500 line-through">₹{p.price}</span>
                      </div>
                    ) : (
                      `₹${p.price}`
                    )}
                  </td>

                  <td className="p-4">
                    {p.category} / {p.subCategory}
                  </td>

                  <td className="p-4">
                    {p.sizes?.map((s) => (
                      <span
                        key={s}
                        className="mr-1 px-2 py-0.5 bg-gray-100 text-xs rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </td>

                  <td className="p-4">
                    {p.bestseller && (
                      <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        <Star size={12} /> Bestseller
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-3">
                    <button 

                    type="button"
                    onClick={() => openEdit(p)}>
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => removeProduct(p._id)}
                      className="text-red-600"
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
            <div key={p._id} className="border-t p-4">
              <div className="flex gap-4">
                {p.image?.[0] ? (
                  <img
                    src={p.image[0]}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.type} · {p.gender}
                  </p>
                  <div className="mt-2">
                    {
                    Math.round(p.discountedPrice) ? (
                      <div>
                        <span className="text-red-500 font-semibold">₹{Math.round(p.discountedPrice)}</span>
                        <span className="ml-2 text-gray-500 line-through">₹{p.price}</span>
                      </div>
                    ) : (
                      <span className="font-semibold">₹{p.price}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => openEdit(p)}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => removeProduct(p._id)} className="text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="font-semibold">Sizes:</span>
                {p.sizes?.map((s) => (
                  <span
                    key={s}
                    className="mr-1 px-2 py-0.5 bg-gray-100 text-xs rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-2">
                {p.bestseller && (
                  <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-full overflow-y-auto p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-4">
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
                className="md:col-span-2 border px-3 py-2 rounded"
              />

              <textarea
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="md:col-span-2 border px-3 py-2 rounded"
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <input
                type="number"
                placeholder="Discount %"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <input
                placeholder="Sub Category"
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <input
                placeholder="Type (Saree / Kurta / Suit)"
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                className="border px-3 py-2 rounded"
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
                className="border px-3 py-2 rounded"
              />

              <input
                placeholder="Sizes (comma separated)"
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
                className="md:col-span-2 border px-3 py-2 rounded"
              />



              <input
                placeholder="Print Type"
                value={form.print}
                onChange={(e) =>
                  setForm({ ...form, print: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.bestseller}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bestseller: e.target.checked,
                    })
                  }
                />
                Bestseller
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.exclusivity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      exclusivity: e.target.checked,
                    })
                  }
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
                className="md:col-span-2"
              />

              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded"
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
