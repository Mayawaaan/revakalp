import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import useStore from "../../store/store";

const inputCls = "w-full border border-[#38131E]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60 bg-white";

const ManageCollections = () => {
  const { showToast, token } = useStore();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);
  const [form, setForm] = useState({ id: "", name: "", description: "" });
  const [image, setImage] = useState(null);

  const api = useMemo(
    () => axios.create({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const fetchCollections = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/collections");
      setCollections(res.data);
    } catch {
      showToast("Failed to load collections", "error");
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);

  const openCreate = () => {
    setEditing(false); setActiveCollection(null);
    setForm({ id: "", name: "", description: "" }); setImage(null);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(true); setActiveCollection(c);
    setForm({ name: c.name, description: c.description }); setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setImage(null); };

  const submitForm = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (!editing) data.append("id", form.id);
    data.append("name", form.name);
    data.append("description", form.description);
    if (image) data.append("image", image);
    try {
      if (editing) {
        await api.put(`/api/admin/collections/${activeCollection._id}`, data);
        showToast("Collection updated", "success");
      } else {
        await api.post("/api/admin/collections", data);
        showToast("Collection created", "success");
      }
      closeModal(); fetchCollections();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to save collection", "error");
    }
  };

  const deleteCollection = async (id) => {
    if (!window.confirm("Delete this collection permanently?")) return;
    try {
      await api.delete(`/api/admin/collections/${id}`);
      showToast("Collection deleted", "success"); fetchCollections();
    } catch { showToast("Delete failed", "error"); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">Storefront</p>
          <h1 className="text-3xl font-serif text-[#38131E]">Collections</h1>
          <p className="text-[#5C4E52] text-sm mt-1">Manage storefront collections</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2.5 rounded-full text-sm font-medium shadow-sm border border-[#D4AF63]/40 transition-all duration-200"
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
                  <th key={h} className={`px-6 py-4 text-xs uppercase tracking-wider text-[#38131E] font-semibold ${i === 3 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38131E]/10">
              {!loading && collections.length === 0 && (
                <tr><td colSpan="4" className="text-center py-12 text-[#7A6A6E]">No collections found</td></tr>
              )}
              {collections.map((c) => (
                <tr key={c._id} className="hover:bg-[#F7F1E5]/40 transition-colors">
                  <td className="px-6 py-4">
                    {c.image ? (
                      <img src={c.image} alt={c.name} className="h-11 w-11 rounded-xl object-cover shadow-sm" />
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-[#F7F1E5] border border-[#38131E]/15 flex items-center justify-center">
                        <span className="text-[#7A6A6E] text-xs">—</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#1A1718]">{c.name}</td>
                  <td className="px-6 py-4 text-[#5C4E52] text-sm max-w-xs truncate">{c.description}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(c)} className="inline-flex items-center gap-1 text-[#38131E] hover:text-[#9A7A3A] transition text-sm">
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => deleteCollection(c._id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition text-sm">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {c.image && <img src={c.image} alt={c.name} className="h-14 w-14 rounded-xl object-cover" />}
                  <div>
                    <p className="font-medium text-[#1A1718]">{c.name}</p>
                    <p className="text-[#5C4E52] text-sm">{c.description}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button onClick={() => openEdit(c)} className="text-[#38131E] hover:text-[#9A7A3A] transition"><Edit2 size={15} /></button>
                  <button onClick={() => deleteCollection(c._id)} className="text-red-600 hover:text-red-700 transition"><Trash2 size={15} /></button>
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
            <button onClick={closeModal} className="absolute top-4 right-4 text-[#7A6A6E] hover:text-[#38131E] transition">
              <X size={18} />
            </button>
            <h2 className="font-serif text-xl text-[#38131E] mb-5">
              {editing ? "Edit Collection" : "Add Collection"}
            </h2>
            <form onSubmit={submitForm} className="space-y-4">
              {!editing && (
                <input required placeholder="Collection ID (e.g. saree, indo-western)"
                  className={inputCls} value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })} />
              )}
              <input required placeholder="Collection Name" className={inputCls} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea required rows={3} placeholder="Description" className={inputCls} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input type="file" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-[#38131E]" />
              {(image || activeCollection?.image) && (
                <img
                  src={image ? URL.createObjectURL(image) : activeCollection.image}
                  alt="Preview" className="h-24 rounded-xl object-cover shadow-sm"
                />
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="text-sm text-[#5C4E52] hover:text-[#38131E] transition px-4 py-2">
                  Cancel
                </button>
                <button type="submit" className="bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-6 py-2 rounded-full text-sm font-medium border border-[#D4AF63]/40 shadow-sm transition-all duration-200">
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