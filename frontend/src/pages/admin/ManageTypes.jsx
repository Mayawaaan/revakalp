import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, List } from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const inputCls = "w-full border border-pink-200 rounded-xl px-3 py-2.5 text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300 bg-white/80";

const ManageTypes = () => {
  const { showToast } = useStore();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", category: "" });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => { fetchTypes(); }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/types");
      setTypes(res.data);
    } catch {
      showToast("Failed to load types", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(false); setActiveType(null);
    setForm({ name: "", slug: "", category: "" });
    setImage(null); setExistingImage("");
    setModalOpen(true);
  };

  const openEdit = (type) => {
    setEditing(true); setActiveType(type);
    setForm({ name: type.name, slug: type.slug, category: type.category });
    setExistingImage(type.image || ""); setImage(null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setActiveType(null); setImage(null); setExistingImage(""); };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("slug", form.slug);
    data.append("category", form.category);
    if (image) data.append("image", image);
    if (!image && existingImage) data.append("existingImage", existingImage);
    try {
      if (editing) {
        await axios.put(`/api/admin/types/${activeType._id}`, data);
        showToast("Type updated", "success");
      } else {
        await axios.post("/api/admin/types", data);
        showToast("Type created", "success");
      }
      closeModal(); fetchTypes();
    } catch { showToast("Failed to save type", "error"); }
    finally { setLoading(false); }
  };

  const removeType = async (_id) => {
    if (!window.confirm("Delete this type permanently?")) return;
    try {
      await axios.delete(`/api/admin/types/${_id}`);
      showToast("Type deleted", "success"); fetchTypes();
    } catch { showToast("Failed to delete type", "error"); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-1 font-medium">Catalog</p>
          <h1 className="text-3xl font-serif text-pink-900">Product Types</h1>
          <p className="text-pink-600 text-sm mt-1">Manage product type classifications</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-[#c9487c] to-[#9d2a52] hover:from-[#b53f6c] hover:to-[#7b1c3e] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-pink-200 transition-all duration-200"
        >
          <Plus size={15} /> Add Type
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-pink-50/80 border-b border-pink-100">
              <tr>
                {["Type", "Category", "Slug", "Image", "Actions"].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-xs uppercase tracking-wider text-pink-500 font-semibold ${i === 4 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {types.map((t) => (
                <tr key={t._id} className="hover:bg-pink-50/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-pink-900">{t.name}</td>
                  <td className="px-6 py-4 capitalize text-pink-700">{t.category}</td>
                  <td className="px-6 py-4 text-xs text-pink-400 font-mono">{t.slug}</td>
                  <td className="px-6 py-4">
                    {t.image ? (
                      <img src={t.image} className="h-10 w-10 rounded-xl object-cover shadow-sm" alt={t.name} />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100">
                        <ImageIcon size={14} className="text-pink-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(t)} className="text-pink-500 hover:text-pink-800 transition"><Edit2 size={14} /></button>
                    <button onClick={() => removeType(t._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!types.length && !loading && (
                <tr><td colSpan="5" className="text-center py-12 text-pink-400">No types found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden">
          {types.map((t) => (
            <div key={t._id} className="border-t border-pink-50 p-4 flex items-center gap-4">
              {t.image ? (
                <img src={t.image} className="h-14 w-14 rounded-xl object-cover" alt={t.name} />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100">
                  <ImageIcon size={20} className="text-pink-300" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-pink-900">{t.name}</p>
                <p className="text-sm capitalize text-pink-500">{t.category}</p>
                <p className="text-xs text-pink-400 font-mono mt-0.5">{t.slug}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button onClick={() => openEdit(t)} className="text-pink-500 hover:text-pink-800 transition"><Edit2 size={16} /></button>
                <button onClick={() => removeType(t._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={submitForm}
            className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl border border-pink-100 relative"
          >
            <button type="button" onClick={closeModal} className="absolute top-4 right-4 text-pink-400 hover:text-pink-700 transition">
              <X size={18} />
            </button>
            <h2 className="font-serif text-xl text-pink-900">{editing ? "Edit Type" : "Add Type"}</h2>

            <input required placeholder="Type name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            <input required placeholder="Slug (e.g. banarasi-saree)" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} />
            <input required placeholder="Category" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} />

            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-pink-700" />

            {(image || existingImage) && (
              <img
                src={image ? URL.createObjectURL(image) : existingImage}
                className="h-20 w-20 rounded-xl object-cover shadow-sm"
                alt="Preview"
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeModal} className="text-sm text-pink-500 hover:text-pink-800 transition px-4 py-2">
                Cancel
              </button>
              <button type="submit" className="bg-gradient-to-r from-[#c9487c] to-[#9d2a52] hover:from-[#b53f6c] hover:to-[#7b1c3e] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg shadow-pink-200 transition-all duration-200">
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageTypes;
