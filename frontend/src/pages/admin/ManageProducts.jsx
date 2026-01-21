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
    adminProductLoading,
    fetchAdminProducts,
    addAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
    showToast,
  } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    type: "",
    gender: "Women",
    state: "",
    sizes: [],
    bestseller: false,
    print: "",
    exclusivity: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  const openCreate = () => {
    setEditing(false);
    setActiveProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      subCategory: "",
      type: "",
      gender: "Women",
      state: "",
      sizes: [],
      bestseller: false,
      print: "",
      exclusivity: "",
    });
    setImages([]);
    setExistingImages([]);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(true);
    setActiveProduct(p);
    setForm({
      ...p,
      sizes: p.sizes || [],
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

  const submitForm = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "sizes") {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    images.forEach((img) => data.append("images", img));
    data.append("existingImages", JSON.stringify(existingImages));

    try {
      if (editing) {
        await updateAdminProduct(activeProduct._id, data);
        showToast("Product updated", "success");
      } else {
        await addAdminProduct(data);
        showToast("Product created", "success");
      }
      closeModal();
    } catch {
      showToast("Failed to save product", "error");
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    await deleteAdminProduct(id);
    showToast("Product deleted", "success");
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 mt-1">
            Manage catalog, pricing, images, and visibility
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Sizes</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminProducts.map((p) => (
              <tr key={p._id} className="border-b last:border-none">

                {/* Product */}
                <td className="px-6 py-4 flex items-center gap-4">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-md">
                      <ImageIcon size={18} />
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.type} · {p.gender}
                    </p>
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4 font-semibold">
                  ₹{p.price}
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-gray-600">
                  {p.category} / {p.subCategory}
                </td>

                {/* Sizes */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {p.sizes?.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {p.bestseller && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      <Star size={12} /> Bestseller
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-gray-700 hover:text-gray-900 inline-flex gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => removeProduct(p._id)}
                    className="text-red-600 hover:text-red-700 inline-flex gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-6">
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            {/* FORM */}
            <form onSubmit={submitForm} className="grid grid-cols-2 gap-4">

              <input
                required
                placeholder="Product name"
                className="col-span-2 border rounded-md px-3 py-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <textarea
                rows={3}
                placeholder="Description"
                className="col-span-2 border rounded-md px-3 py-2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Price"
                className="border rounded-md px-3 py-2"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <input
                placeholder="Category"
                className="border rounded-md px-3 py-2"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              <input
                placeholder="Sub Category"
                className="border rounded-md px-3 py-2"
                value={form.subCategory}
                onChange={(e) =>
                  setForm({ ...form, subCategory: e.target.value })
                }
              />

              <input
                placeholder="Type"
                className="border rounded-md px-3 py-2"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />

              <input
                placeholder="Sizes (comma separated)"
                className="col-span-2 border rounded-md px-3 py-2"
                value={form.sizes.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sizes: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />

              <label className="col-span-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.bestseller}
                  onChange={(e) =>
                    setForm({ ...form, bestseller: e.target.checked })
                  }
                />
                Mark as Bestseller
              </label>

              <div className="col-span-2 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
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
