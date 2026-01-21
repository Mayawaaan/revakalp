import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import useStore from "../../store/store";

const ManageTypes = () => {
  const { showToast } = useStore();

  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeType, setActiveType] = useState(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/types");
      setTypes(res.data);
    } catch (e) {
      showToast("Failed to load types", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(false);
    setActiveType(null);
    setForm({ id: "", name: "", category: "" });
    setImage(null);
    setExistingImage("");
    setModalOpen(true);
  };

  const openEdit = (type) => {
    setEditing(true);
    setActiveType(type);
    setForm({
      id: type.id,
      name: type.name,
      category: type.category,
    });
    setExistingImage(type.image || "");
    setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveType(null);
    setImage(null);
    setExistingImage("");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("id", form.id);
    data.append("name", form.name);
    data.append("category", form.category);
    if (image) data.append("image", image);
    if (!image && existingImage)
      data.append("existingImage", existingImage);

    try {
      if (editing) {
        await axios.put(`/api/admin/types/${activeType.id}`, data);
        showToast("Type updated", "success");
      } else {
        await axios.post("/api/admin/types", data);
        showToast("Type created", "success");
      }
      closeModal();
      fetchTypes();
    } catch {
      showToast("Failed to save type", "error");
    } finally {
      setLoading(false);
    }
  };

  const removeType = async (id) => {
    if (!window.confirm("Delete this type permanently?")) return;
    try {
      await axios.delete(`/api/admin/types/${id}`);
      showToast("Type deleted", "success");
      fetchTypes();
    } catch {
      showToast("Failed to delete type", "error");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Product Types
          </h1>
          <p className="text-gray-500 mt-1">
            Manage sub-types used across product categories
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <Plus size={16} /> Add Type
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t) => (
              <tr key={t.id} className="border-b last:border-none">

                {/* Type */}
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {t.id}
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4 text-gray-600 capitalize">
                  {t.category}
                </td>

                {/* Image */}
                <td className="px-6 py-4">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                      <ImageIcon size={16} />
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => openEdit(t)}
                    className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => removeType(t.id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {types.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            No types created yet.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-6">
              {editing ? "Edit Type" : "Add Type"}
            </h2>

            <form onSubmit={submitForm} className="space-y-4">

              <input
                required
                placeholder="Type ID (slug)"
                disabled={editing}
                className="border rounded-md px-3 py-2 w-full"
                value={form.id}
                onChange={(e) =>
                  setForm({ ...form, id: e.target.value })
                }
              />

              <input
                required
                placeholder="Type name"
                className="border rounded-md px-3 py-2 w-full"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                required
                placeholder="Category (saree, suit, kurta)"
                className="border rounded-md px-3 py-2 w-full"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="text-sm"
              />

              {(image || existingImage) && (
                <img
                  src={image ? URL.createObjectURL(image) : existingImage}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded-md"
                />
              )}

              <div className="flex justify-end gap-3 pt-4">
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
                  disabled={loading}
                >
                  {loading ? "Saving..." : editing ? "Update Type" : "Create Type"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageTypes;
