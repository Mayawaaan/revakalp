import React, { useCallback, useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const inputCls = "w-full border border-[#38131E]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60 bg-white";

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

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/types");
      setTypes(res.data);
    } catch {
      showToast("Failed to load types", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchTypes(); }, [fetchTypes]);

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
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">Catalog</p>
          <h1 className="text-3xl font-serif text-[#38131E]">Product Types</h1>
          <p className="text-[#5C4E52] text-sm mt-1">Manage product type classifications</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2.5 rounded-full text-sm font-medium shadow-sm border border-[#D4AF63]/40 transition-all duration-200"
        >
          <Plus size={15} /> Add Type
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F7F1E5]/70 border-b border-[#38131E]/12">
              <tr>
                {["Type", "Category", "Slug", "Image", "Actions"].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-xs uppercase tracking-wider text-[#38131E] font-semibold ${i === 4 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38131E]/10">
              {types.map((t) => (
                <tr key={t._id} className="hover:bg-[#F7F1E5]/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1A1718]">{t.name}</td>
                  <td className="px-6 py-4 capitalize text-[#5C4E52]">{t.category}</td>
                  <td className="px-6 py-4 text-xs text-[#7A6A6E] font-mono">{t.slug}</td>
                  <td className="px-6 py-4">
                    {t.image ? (
                      <img src={t.image} className="h-10 w-10 rounded-xl object-cover shadow-sm" alt={t.name} />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-[#F7F1E5] flex items-center justify-center border border-[#38131E]/15">
                        <ImageIcon size={14} className="text-[#7A6A6E]" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(t)} className="text-[#38131E] hover:text-[#9A7A3A] transition"><Edit2 size={14} /></button>
                    <button onClick={() => removeType(t._id)} className="text-red-600 hover:text-red-700 transition"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {!types.length && !loading && (
                <tr><td colSpan="5" className="text-center py-12 text-[#7A6A6E]">No types found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden">
          {types.map((t) => (
            <div key={t._id} className="border-t border-[#38131E]/10 p-4 flex items-center gap-4">
              {t.image ? (
                <img src={t.image} className="h-14 w-14 rounded-xl object-cover" alt={t.name} />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-[#F7F1E5] flex items-center justify-center border border-[#38131E]/15">
                  <ImageIcon size={20} className="text-[#7A6A6E]" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-[#1A1718]">{t.name}</p>
                <p className="text-sm capitalize text-[#5C4E52]">{t.category}</p>
                <p className="text-xs text-[#7A6A6E] font-mono mt-0.5">{t.slug}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button onClick={() => openEdit(t)} className="text-[#38131E] hover:text-[#9A7A3A] transition"><Edit2 size={16} /></button>
                <button onClick={() => removeType(t._id)} className="text-red-600 hover:text-red-700 transition"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#1A1718]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form
            onSubmit={submitForm}
            className="bg-white rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl border border-[#38131E]/15 relative"
          >
            <button type="button" onClick={closeModal} className="absolute top-4 right-4 text-[#7A6A6E] hover:text-[#38131E] transition">
              <X size={18} />
            </button>
            <h2 className="font-serif text-xl text-[#38131E]">{editing ? "Edit Type" : "Add Type"}</h2>

            <input required placeholder="Type name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            <input required placeholder="Slug (e.g. banarasi-saree)" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} />
            <input required placeholder="Category" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} />

            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-[#38131E]" />

            {(image || existingImage) && (
              <img
                src={image ? URL.createObjectURL(image) : existingImage}
                className="h-20 w-20 rounded-xl object-cover shadow-sm"
                alt="Preview"
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
      )}
    </div>
  );
};

export default ManageTypes;
