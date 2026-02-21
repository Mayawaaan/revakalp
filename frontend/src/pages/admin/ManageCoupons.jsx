import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, X, Percent } from "lucide-react";
import useStore from "../../store/store";

const ManageCoupons = () => {
  const { showToast } = useStore();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);

  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    description: "",
    isActive: true,
    expiryDate: "",
    maxUses: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/api/admin/coupons");
      setCoupons(res.data);
    } catch {
      showToast("Failed to load coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(false);
    setActiveCoupon(null);
    setForm({
      code: "",
      discountPercentage: "",
      description: "",
      isActive: true,
      expiryDate: "",
      maxUses: "",
    });
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditing(true);
    setActiveCoupon(coupon);
    setForm({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      description: coupon.description || "",
      isActive: coupon.isActive,
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
      maxUses: coupon.maxUses || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveCoupon(null);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await axios.put(
          `/api/admin/coupons/${activeCoupon._id}`,
          form
        );
        showToast("Coupon updated", "success");
      } else {
        await axios.post("/api/admin/coupons", form);
        showToast("Coupon created", "success");
      }
      closeModal();
      fetchCoupons();
    } catch {
      showToast("Failed to save coupon", "error");
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon permanently?")) return;
    try {
      await axios.delete(`/api/admin/coupons/${id}`);
      showToast("Coupon deleted", "success");
      fetchCoupons();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Coupons
          </h1>
          <p className="text-gray-500 mt-1">
            Manage discount codes and promotions
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <Plus size={16} />
          Add Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="hidden md:block">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Discount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Expiry</th>
                <th className="px-6 py-3">Max Uses</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && coupons.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No coupons created yet
                  </td>
                </tr>
              )}

              {coupons.map((c) => (
                <tr key={c._id} className="border-b last:border-none">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">
                    {c.code}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-1 font-semibold">
                    <Percent size={14} />
                    {c.discountPercentage}%
                  </td>

                  <td className="px-6 py-4">
                    {c.isActive ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {c.expiryDate
                      ? new Date(c.expiryDate).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {c.maxUses || "Unlimited"}
                  </td>

                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => openEdit(c)}
                      className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteCoupon(c._id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden">
          {!loading && coupons.length === 0 && (
            <div className="px-6 py-10 text-center text-gray-500">
              No coupons created yet
            </div>
          )}
          {coupons.map((c) => (
            <div key={c._id} className="border-b last:border-none p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-medium text-gray-900">
                    {c.code}
                  </p>
                  <div className="mt-1 flex items-center gap-1 font-semibold text-sm">
                    <Percent size={14} />
                    {c.discountPercentage}%
                  </div>
                </div>
                {c.isActive ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600">
                    Inactive
                  </span>
                )}
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <div className="text-gray-600">
                  <p>
                    Expiry:{" "}
                    {c.expiryDate
                      ? new Date(c.expiryDate).toLocaleDateString()
                      : "—"}
                  </p>
                  <p>
                    Max Uses: {c.maxUses || "Unlimited"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => openEdit(c)}
                    className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteCoupon(c._id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
              {editing ? "Edit Coupon" : "Create Coupon"}
            </h2>

            <form onSubmit={submitForm} className="space-y-4">

              <input
                required
                placeholder="Coupon Code (e.g. DIWALI10)"
                className="w-full border rounded-md px-3 py-2"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
              />

              <input
                required
                type="number"
                placeholder="Discount Percentage"
                className="w-full border rounded-md px-3 py-2"
                value={form.discountPercentage}
                onChange={(e) =>
                  setForm({ ...form, discountPercentage: e.target.value })
                }
              />

              <textarea
                rows={2}
                placeholder="Optional description"
                className="w-full border rounded-md px-3 py-2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="border rounded-md px-3 py-2"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({ ...form, expiryDate: e.target.value })
                  }
                />

                <input
                  type="number"
                  placeholder="Usage limit"
                  className="border rounded-md px-3 py-2"
                  value={form.maxUses}
                  onChange={(e) =>
                    setForm({ ...form, maxUses: e.target.value })
                  }
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                />
                Coupon is active
              </label>

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

export default ManageCoupons;
