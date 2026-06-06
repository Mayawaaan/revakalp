import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Plus, Edit2, Trash2, X, Percent, Ticket } from "lucide-react";
import useStore from "../../store/store";

const inputCls = "w-full border border-pink-200 rounded-xl px-3 py-2.5 text-sm text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300 bg-white/80";

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-[#c9487c]" : "bg-pink-200"}`} />
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
    </div>
    <span className="text-sm text-pink-800">{label}</span>
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

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/api/admin/coupons");
      setCoupons(res.data);
    } catch { showToast("Failed to load coupons", "error"); }
    finally { setLoading(false); }
  };

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
          <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-1 font-medium">Promotions</p>
          <h1 className="text-3xl font-serif text-pink-900">Coupons</h1>
          <p className="text-pink-600 text-sm mt-1">Manage discount codes and promotions</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-[#c9487c] to-[#9d2a52] hover:from-[#b53f6c] hover:to-[#7b1c3e] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-pink-200 transition-all duration-200"
        >
          <Plus size={15} /> Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-pink-50/80 border-b border-pink-100">
              <tr>
                {["Code", "Discount", "Status", "Expiry", "Max Uses", "Actions"].map((h, i) => (
                  <th key={h} className={`px-6 py-4 text-xs uppercase tracking-wider text-pink-500 font-semibold ${i === 5 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {!loading && coupons.length === 0 && (
                <tr><td colSpan="6" className="text-center py-12 text-pink-400">No coupons created yet</td></tr>
              )}
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-pink-50/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold text-pink-900 text-sm">
                    <span className="bg-pink-50 border border-pink-200 px-2 py-1 rounded-lg">{c.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 font-semibold text-[#c9487c]">
                      <Percent size={13} />{c.discountPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {c.isActive ? (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">Active</span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-pink-50 text-pink-400 border border-pink-200">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-pink-600 text-sm">
                    {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 text-pink-600 text-sm">{c.maxUses || "Unlimited"}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(c)} className="inline-flex items-center gap-1 text-pink-500 hover:text-pink-800 transition text-sm"><Edit2 size={13} /> Edit</button>
                    <button onClick={() => deleteCoupon(c._id)} className="inline-flex items-center gap-1 text-red-400 hover:text-red-600 transition text-sm"><Trash2 size={13} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="md:hidden">
          {!loading && coupons.length === 0 && (
            <div className="text-center py-12 text-pink-400">No coupons created yet</div>
          )}
          {coupons.map((c) => (
            <div key={c._id} className="border-t border-pink-50 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-semibold text-pink-900 bg-pink-50 border border-pink-200 px-2 py-1 rounded-lg text-sm">{c.code}</span>
                  <div className="mt-2 flex items-center gap-1 font-semibold text-[#c9487c] text-sm">
                    <Percent size={13} />{c.discountPercentage}%
                  </div>
                </div>
                {c.isActive ? (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">Active</span>
                ) : (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-pink-50 text-pink-400 border border-pink-200">Inactive</span>
                )}
              </div>
              <div className="mt-3 flex justify-between text-sm text-pink-600">
                <div>
                  <p>Expiry: {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "—"}</p>
                  <p>Max Uses: {c.maxUses || "Unlimited"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => openEdit(c)} className="text-pink-500 hover:text-pink-800 transition"><Edit2 size={15} /></button>
                  <button onClick={() => deleteCoupon(c._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-xl p-6 relative shadow-2xl border border-pink-100">
            <button onClick={closeModal} className="absolute top-4 right-4 text-pink-400 hover:text-pink-700 transition"><X size={18} /></button>
            <h2 className="font-serif text-xl text-pink-900 mb-5">{editing ? "Edit Coupon" : "Create Coupon"}</h2>
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
                <button type="button" onClick={closeModal} className="text-sm text-pink-500 hover:text-pink-800 transition px-4 py-2">Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-[#c9487c] to-[#9d2a52] hover:from-[#b53f6c] hover:to-[#7b1c3e] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg shadow-pink-200 transition-all duration-200">
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
