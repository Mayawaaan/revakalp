import React, { useCallback, useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Plus, Edit2, Trash2, X, Percent, Ticket } from "lucide-react";
import useStore from "../../store/store";

const inputCls = "w-full border border-[#38131E]/20 rounded-xl px-3 py-2.5 text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60 bg-white";

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-[#38131E]" : "bg-[#38131E]/20"}`} />
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
    </div>
    <span className="text-sm text-[#1A1718]">{label}</span>
  </label>
);

const ManageCoupons = () => {
  const { showToast } = useStore();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [form, setForm] = useState({
    code: "", discountPercentage: "", description: "",
    isActive: true, expiryDate: "", maxUses: "",
  });

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/coupons");
      setCoupons(res.data);
    } catch { showToast("Failed to load coupons", "error"); }
    finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const openCreate = () => {
    setEditing(false); setActiveCoupon(null);
    setForm({ code: "", discountPercentage: "", description: "", isActive: true, expiryDate: "", maxUses: "" });
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(true); setActiveCoupon(c);
    setForm({
      code: c.code, discountPercentage: c.discountPercentage,
      description: c.description || "", isActive: c.isActive,
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split("T")[0] : "",
      maxUses: c.maxUses || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setActiveCoupon(null); };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/admin/coupons/${activeCoupon._id}`, form);
        showToast("Coupon updated", "success");
      } else {
        await axios.post("/api/admin/coupons", form);
        showToast("Coupon created", "success");
      }
      closeModal(); fetchCoupons();
    } catch { showToast("Failed to save coupon", "error"); }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon permanently?")) return;
    try {
      await axios.delete(`/api/admin/coupons/${id}`);
      showToast("Coupon deleted", "success"); fetchCoupons();
    } catch { showToast("Delete failed", "error"); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">Promotions</p>
          <h1 className="text-3xl font-serif text-[#38131E]">Coupons</h1>
          <p className="text-[#5C4E52] text-sm mt-1">Manage discount codes and promotions</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2.5 rounded-full text-sm font-medium shadow-sm border border-[#D4AF63]/40 transition-all duration-200"
        >
          <Plus size={15} /> Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F7F1E5]/70 border-b border-[#38131E]/12">
              <tr>
                {["Code", "Discount", "Status", "Expiry", "Max Uses", "Actions"].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-xs uppercase tracking-wider text-[#38131E] font-semibold ${i === 5 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38131E]/10">
              {!loading && coupons.length === 0 && (
                <tr><td colSpan="6" className="text-center py-12 text-[#7A6A6E]">No coupons created yet</td></tr>
              )}
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-[#F7F1E5]/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-[#1A1718] text-sm">
                    <span className="inline-flex items-center gap-1.5 bg-[#F7F1E5] border border-[#38131E]/20 px-2.5 py-1 rounded-lg">
                      <Ticket size={12} className="text-[#9A7A3A]" />
                      {c.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 font-semibold text-[#38131E]">
                      <Percent size={13} className="text-[#9A7A3A]" />{c.discountPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {c.isActive ? (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-[#F7F1E5] text-[#7A6A6E] border border-[#38131E]/15">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#5C4E52] text-sm">
                    {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 text-[#5C4E52] text-sm">{c.maxUses || "Unlimited"}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(c)} className="inline-flex items-center gap-1 text-[#38131E] hover:text-[#9A7A3A] transition text-sm"><Edit2 size={13} /> Edit</button>
                    <button onClick={() => deleteCoupon(c._id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition text-sm"><Trash2 size={13} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden">
          {!loading && coupons.length === 0 && (
            <div className="text-center py-12 text-[#7A6A6E]">No coupons created yet</div>
          )}
          {coupons.map((c) => (
            <div key={c._id} className="border-t border-[#38131E]/10 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-semibold text-[#1A1718] bg-[#F7F1E5] border border-[#38131E]/20 px-2 py-1 rounded-lg text-sm">{c.code}</span>
                  <div className="mt-2 flex items-center gap-1 font-semibold text-[#38131E] text-sm">
                    <Percent size={13} className="text-[#9A7A3A]" />{c.discountPercentage}%
                  </div>
                </div>
                {c.isActive ? (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                ) : (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-[#F7F1E5] text-[#7A6A6E] border border-[#38131E]/15">Inactive</span>
                )}
              </div>
              <div className="mt-3 flex justify-between text-sm text-[#5C4E52]">
                <div>
                  <p>Expiry: {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "—"}</p>
                  <p>Max Uses: {c.maxUses || "Unlimited"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => openEdit(c)} className="text-[#38131E] hover:text-[#9A7A3A] transition"><Edit2 size={15} /></button>
                  <button onClick={() => deleteCoupon(c._id)} className="text-red-600 hover:text-red-700 transition"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-[#1A1718]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 relative shadow-2xl border border-[#38131E]/15">
            <button onClick={closeModal} className="absolute top-4 right-4 text-[#7A6A6E] hover:text-[#38131E] transition"><X size={18} /></button>
            <h2 className="font-serif text-xl text-[#38131E] mb-5">{editing ? "Edit Coupon" : "Create Coupon"}</h2>
            <form onSubmit={submitForm} className="space-y-4">
              <input required placeholder="Coupon Code (e.g. DIWALI10)" className={inputCls}
                value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              <input required type="number" placeholder="Discount Percentage" className={inputCls}
                value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} />
              <textarea rows={2} placeholder="Optional description" className={inputCls}
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className={inputCls} value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
                <input type="number" placeholder="Usage limit" className={inputCls}
                  value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
              </div>
              <Toggle checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} label="Coupon is active" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="text-sm text-[#5C4E52] hover:text-[#38131E] transition px-4 py-2">Cancel</button>
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

export default ManageCoupons;
