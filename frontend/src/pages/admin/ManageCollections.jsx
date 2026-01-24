import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import useStore from "../../store/store";

const ManageCollections = () => {
  const { showToast, token } = useStore();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [image, setImage] = useState(null);

  /* =========================
     API CONFIG
  ========================= */
  const api = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await api.get("/api/admin/collections");
      setCollections(res.data);
    } catch {
      showToast("Failed to load collections", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     MODAL HANDLERS
  ========================= */
  const openCreate = () => {
    setEditing(false);
    setActiveCollection(null);
    setForm({ name: "", description: "" });
    setImage(null);
    setModalOpen(true);
  };

  const openEdit = (collection) => {
    setEditing(true);
    setActiveCollection(collection);
    setForm({
      name: collection.name,
      description: collection.description,
    });
    setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setImage(null);
  };

  /* =========================
     SUBMIT
  ========================= */
  const submitForm = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    if (image) data.append("image", image);

    try {
      if (editing) {
        await api.put(
          `/api/admin/collections/${activeCollection._id}`,
          data
        );
        showToast("Collection updated", "success");
      } else {
        await api.post("/api/admin/collections", data);
        showToast("Collection created", "success");
      }

      closeModal();
      fetchCollections();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to save collection",
        "error"
      );
    }
  };

  /* =========================
     DELETE
  ========================= */
  const deleteCollection = async (id) => {
    if (!window.confirm("Delete this collection permanently?")) return;

    try {
      await api.delete(`/api/admin/collections/${id}`);
      showToast("Collection deleted", "success");
      fetchCollections();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Collections</h1>
          <p className="text-gray-500 mt-1">
            Manage storefront collections
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md"
        >
          <Plus size={16} />
          Add Collection
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading && collections.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                  No collections found
                </td>
              </tr>
            )}

            {collections.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="px-6 py-4">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  )}
                </td>
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-gray-600">{c.description}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => openEdit(c)}
                    className="text-gray-700"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => deleteCollection(c._id)}
                    className="text-red-600"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-xl p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-6">
              {editing ? "Edit Collection" : "Add Collection"}
            </h2>

            <form onSubmit={submitForm} className="space-y-4">
              <input
                required
                placeholder="Collection Name"
                className="w-full border rounded-md px-3 py-2"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <textarea
                required
                rows={3}
                placeholder="Description"
                className="w-full border rounded-md px-3 py-2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />

              {(image || activeCollection?.image) && (
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : activeCollection.image
                  }
                  alt="Preview"
                  className="h-24 rounded-md object-cover"
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
                  className="px-4 py-2 bg-gray-900 text-white rounded-md"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCollections;
