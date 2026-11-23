import React, { useCallback, useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import useStore from "../../store/store";

const inputCls =
  "w-full border border-[#38131E]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60 bg-white";

const ManageCollections = () => {
  const { showToast, fetchCollections: refreshPublicCollections } = useStore();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);
  const [form, setForm] = useState({ id: "", name: "", description: "" });
  const [image, setImage] = useState(null);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/collections");
      setCollections(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load collections", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const openCreate = () => {
    setEditing(false);
    setActiveCollection(null);
    setForm({ id: "", name: "", description: "" });
    setImage(null);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(true);
    setActiveCollection(c);
    setForm({ id: c.id || "", name: c.name || "", description: c.description || "" });
    setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveCollection(null);
    setImage(null);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (!editing) data.append("id", form.id.trim().toLowerCase());
    data.append("name", form.name.trim());
    data.append("description", form.description.trim());
    if (image) data.append("image", image);

    setSaving(true);
    try {
      if (editing) {
        await axios.put(`/api/admin/collections/${activeCollection._id}`, data);
        showToast("Collection updated", "success");
      } else {
        await axios.post("/api/admin/collections", data);
        showToast("Collection created", "success");
      }
      closeModal();
      await fetchCollections();
      refreshPublicCollections?.();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to save collection", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteCollection = async (id) => {
    if (!window.confirm("Delete this collection permanently?")) return;
    try {
      await axios.delete(`/api/admin/collections/${id}`);
      showToast("Collection deleted", "success");
      await fetchCollections();
      refreshPublicCollections?.();
    } catch (err) {
      showToast(err?.response?.data?.message || "Delete failed", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">
            Storefront
          </p>
          <h1 className="text-3xl font-serif text-[#38131E]">Collections</h1>
          <p className="text-[#5C4E52] text-sm mt-1">
            Manage storefront categories and navigation collections
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2.5 rounded-full text-sm font-medium shadow-sm border border-[#D4AF63]/40 transition-all duration-200 cursor-pointer"
        >
          <Plus size={15} /> Add Collection
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F7F1E5]/70 border-b border-[#38131E]/12">
              <tr>
                {["Image", "Name", "Description", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-xs uppercase tracking-wider text-[#38131E] font-semibold ${
                      i === 3 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38131E]/10">
              {!loading && collections.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-[#7A6A6E]">
                    No collections found
                  </td>
                </tr>
              )}
              {collections.map((c) => (
                <tr key={c._id} className="hover:bg-[#F7F1E5]/40 transition-colors">
                  <td className="px-6 py-4">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-11 w-11 rounded-xl object-cover shadow-sm"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-[#F7F1E5] border border-[#38131E]/15 flex items-center justify-center">
                        <ImageIcon size={15} className="text-[#7A6A6E]" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1A1718]">{c.name}</p>
                    <p className="text-[11px] font-mono text-[#7A6A6E]">{c.id}</p>
                  </td>
                  <td className="px-6 py-4 text-[#5C4E52] text-sm max-w-xs truncate">
                    {c.description}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="inline-flex items-center gap-1 text-[#38131E] hover:text-[#9A7A3A] transition text-sm cursor-pointer"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCollection(c._id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition text-sm cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {collections.map((c) => (
            <div key={c._id} className="border-t border-[#38131E]/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-14 w-14 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-[#1A1718] truncate">{c.name}</p>
                    <p className="text-[#5C4E52] text-sm line-clamp-2">{c.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="text-[#38131E] hover:text-[#9A7A3A] transition cursor-pointer"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteCollection(c._id)}
                    className="text-red-600 hover:text-red-700 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!loading && collections.length === 0 && (
            <div className="text-center py-12 text-[#7A6A6E]">No collections found</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#1A1718]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 relative shadow-2xl border border-[#38131E]/15">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#7A6A6E] hover:text-[#38131E] transition cursor-pointer"
            >
              <X size={18} />
            </button>
            <h2 className="font-serif text-xl text-[#38131E] mb-5">
              {editing ? "Edit Collection" : "Add Collection"}
            </h2>
            <form onSubmit={submitForm} className="space-y-4">
              {!editing && (
                <input
                  required
                  placeholder="Collection ID (e.g. saree, indo-western)"
                  className={inputCls}
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                />
              )}
              <input
                required
                placeholder="Collection Name"
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                required
                rows={3}
                placeholder="Description"
                className={inputCls}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <label className="flex flex-col items-center justify-center w-full py-4 px-4 border-2 border-dashed border-[#38131E]/22 rounded-xl cursor-pointer hover:border-[#D4AF63] bg-[#F7F1E5]/40 transition">
                <div className="flex items-center gap-2 text-xs font-medium text-[#38131E]">
                  <Upload size={15} />
                  <span>{image ? image.name : "Upload collection cover image"}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {(image || activeCollection?.image) && (
                <img
                  src={image ? URL.createObjectURL(image) : activeCollection.image}
                  alt="Preview"
                  className="h-24 rounded-xl object-cover shadow-sm border border-[#38131E]/15"
                />
              )}

              <div className="flex justify-end gap-3 pt-2">
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
                  {saving ? "Saving…" : editing ? "Update" : "Create"}
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
