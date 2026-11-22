import React, { useCallback, useEffect, useState } from "react";
import { Store, RefreshCw, PackageCheck, ArrowDownUp, CheckCircle2 } from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

export default function InventoryPOS() {
  const showToast = useStore((s) => s.showToast);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState("");
  const [saleQty, setSaleQty] = useState(1);
  const [saleMethod, setSaleMethod] = useState("pos_cash");
  const [saleNote, setSaleNote] = useState("");
  const [submittingSale, setSubmittingSale] = useState(false);

  const [adjustingId, setAdjustingId] = useState("");
  const [adjustValue, setAdjustValue] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const fetchSnapshot = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/inventory");
      setProducts(res.data?.products || []);
      setMovements(res.data?.movements || []);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSnapshot();
  }, [fetchSnapshot]);

  const handlePosSale = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      showToast("Select a piece to record a store sale", "error");
      return;
    }
    setSubmittingSale(true);
    try {
      const idempotencyKey = `pos_${selectedId}_${Date.now()}`;
      const res = await axios.post("/api/admin/inventory/pos-sale", {
        productId: selectedId,
        quantity: Number(saleQty) || 1,
        paymentMethod: saleMethod,
        customerNote: saleNote,
        idempotencyKey,
      });
      showToast(
        `Store sale recorded (${res.data?.order?.orderNumber || "POS"})`,
        "success"
      );
      setSaleNote("");
      setSaleQty(1);
      await fetchSnapshot();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Could not record store sale",
        "error"
      );
    } finally {
      setSubmittingSale(false);
    }
  };

  const handleAdjustSave = async (productId) => {
    if (adjustValue === "") return;
    try {
      await axios.put(`/api/admin/inventory/${productId}/adjust`, {
        newStock: Number(adjustValue),
        reason: adjustReason || "Physical boutique audit",
      });
      showToast("Inventory balance updated", "success");
      setAdjustingId("");
      setAdjustValue("");
      setAdjustReason("");
      await fetchSnapshot();
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Stock adjustment rejected",
        "error"
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#7A6A6E] mb-1 font-medium">
            One Source of Truth
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#38131E]">
            Boutique POS &amp; Shared Inventory
          </h1>
          <p className="text-sm text-[#5C4E52] mt-1">
            Physical counter sales and web checkouts reserve and deduct from the same ledger.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSnapshot}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-[#38131E]/20 bg-white px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold text-[#38131E] hover:bg-[#F7F1E5] cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Ledger
        </button>
      </div>

      {/* Record Boutique Sale */}
      <form
        onSubmit={handlePosSale}
        className="bg-white/95 border border-[#38131E]/15 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2.5 text-[#38131E]">
          <Store size={18} />
          <h2 className="font-serif text-xl">Record Store Sale (Indore Counter)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            required
            className="lg:col-span-2 border border-[#38131E]/20 rounded-xl px-3 py-2.5 text-sm bg-white text-[#1A1718]"
          >
            <option value="">Select piece / SKU code…</option>
            {products.map((p) => (
              <option key={p._id} value={p._id} disabled={p.available <= 0}>
                {p.code || "SKU"} · {p.name} ({p.available} avail)
              </option>
            ))}
          </select>

          <input
            type="number"
            min={1}
            value={saleQty}
            onChange={(e) => setSaleQty(e.target.value)}
            placeholder="Qty"
            className="border border-[#38131E]/20 rounded-xl px-3 py-2.5 text-sm bg-white text-[#1A1718]"
          />

          <select
            value={saleMethod}
            onChange={(e) => setSaleMethod(e.target.value)}
            className="border border-[#38131E]/20 rounded-xl px-3 py-2.5 text-sm bg-white text-[#1A1718]"
          >
            <option value="pos_cash">Counter Cash</option>
            <option value="pos_upi">Counter UPI</option>
            <option value="pos_card">Counter Card</option>
          </select>

          <button
            type="submit"
            disabled={submittingSale}
            className="inline-flex items-center justify-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold cursor-pointer disabled:opacity-50"
          >
            <PackageCheck size={15} />
            {submittingSale ? "Posting…" : "Post Sale"}
          </button>
        </div>

        <input
          type="text"
          value={saleNote}
          onChange={(e) => setSaleNote(e.target.value)}
          placeholder="Optional receipt / customer note"
          className="w-full border border-[#38131E]/15 rounded-xl px-3 py-2 text-sm bg-white text-[#1A1718]"
        />
      </form>

      {/* Live Stock Table */}
      <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-[#38131E]/10 bg-[#F7F1E5]/60">
          <h2 className="font-serif text-lg sm:text-xl text-[#38131E]">Central Stock Table</h2>
        </div>

        {/* Desktop Stock Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F7F1E5]/50 border-b border-[#38131E]/10 text-xs uppercase tracking-wider text-[#38131E]">
              <tr>
                <th className="px-5 py-3 text-left">SKU</th>
                <th className="px-5 py-3 text-left">Garment</th>
                <th className="px-5 py-3 text-right">On Hand</th>
                <th className="px-5 py-3 text-right">Reserved</th>
                <th className="px-5 py-3 text-right">Available</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-right">Reconcile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38131E]/10">
              {products.map((p) => {
                const statusBadge =
                  p.available <= 0
                    ? p.reserved > 0
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
                    : p.available === 1
                    ? "bg-[#F7F1E5] text-[#38131E] border-[#D4AF63]"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200";
                const statusText =
                  p.available <= 0
                    ? p.reserved > 0
                      ? "ON HOLD"
                      : "SOLD"
                    : p.available === 1
                    ? "ONE PIECE"
                    : "AVAILABLE";

                return (
                  <tr key={p._id} className="hover:bg-[#F7F1E5]/40">
                    <td className="px-5 py-3 font-mono text-xs text-[#38131E] font-semibold">
                      {p.code || "—"}
                    </td>
                    <td className="px-5 py-3 font-medium text-[#1A1718]">
                      {p.name}
                      <span className="block text-xs text-[#7A6A6E]">{p.category}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono">{p.onHand}</td>
                    <td className="px-5 py-3 text-right font-mono text-amber-700">
                      {p.reserved}
                    </td>
                    <td className="px-5 py-3 text-right font-mono font-semibold text-[#38131E]">
                      {p.available}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border ${statusBadge}`}
                      >
                        {statusText}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {adjustingId === p._id ? (
                        <div className="inline-flex items-center gap-2">
                          <input
                            type="number"
                            min={p.reserved}
                            value={adjustValue}
                            onChange={(e) => setAdjustValue(e.target.value)}
                            className="w-16 border border-[#38131E]/25 rounded-lg px-2 py-1 text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Reason"
                            value={adjustReason}
                            onChange={(e) => setAdjustReason(e.target.value)}
                            className="w-28 border border-[#38131E]/25 rounded-lg px-2 py-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAdjustSave(p._id)}
                            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdjustingId("")}
                            className="text-[#7A6A6E] text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAdjustingId(p._id);
                            setAdjustValue(String(p.onHand));
                          }}
                          className="text-xs text-[#38131E] hover:underline font-medium cursor-pointer"
                        >
                          Adjust Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-[#7A6A6E]">
                    No catalog products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stock Cards */}
        <div className="md:hidden divide-y divide-[#38131E]/10">
          {products.map((p) => {
            const statusBadge =
              p.available <= 0
                ? p.reserved > 0
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-red-50 text-red-700 border-red-200"
                : p.available === 1
                ? "bg-[#F7F1E5] text-[#38131E] border-[#D4AF63]"
                : "bg-emerald-50 text-emerald-700 border-emerald-200";
            const statusText =
              p.available <= 0
                ? p.reserved > 0
                  ? "ON HOLD"
                  : "SOLD"
                : p.available === 1
                ? "ONE PIECE"
                : "AVAILABLE";

            return (
              <div key={p._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-[#38131E]/75 font-semibold">
                      {p.code || "SKU"} · {p.category}
                    </p>
                    <p className="font-medium text-sm text-[#1A1718] break-words">
                      {p.name}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${statusBadge}`}
                  >
                    {statusText}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F7F1E5]/60 p-2.5 text-center border border-[#38131E]/10">
                  <div>
                    <p className="text-[10px] uppercase text-[#7A6A6E]">On Hand</p>
                    <p className="font-mono text-sm font-semibold text-[#1A1718]">{p.onHand}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#7A6A6E]">Reserved</p>
                    <p className="font-mono text-sm font-semibold text-amber-700">{p.reserved}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#7A6A6E]">Avail</p>
                    <p className="font-mono text-sm font-semibold text-[#38131E]">{p.available}</p>
                  </div>
                </div>

                {adjustingId === p._id ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="number"
                      min={p.reserved}
                      value={adjustValue}
                      onChange={(e) => setAdjustValue(e.target.value)}
                      className="w-20 border border-[#38131E]/25 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Reason"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      className="flex-1 min-w-[110px] border border-[#38131E]/25 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleAdjustSave(p._id)}
                        className="px-3 py-1.5 rounded-lg bg-[#38131E] text-[#F7F1E5] text-xs font-semibold cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjustingId("")}
                        className="text-[#7A6A6E] text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setAdjustingId(p._id);
                        setAdjustValue(String(p.onHand));
                      }}
                      className="text-xs text-[#38131E] hover:underline font-semibold cursor-pointer"
                    >
                      Adjust Stock
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {!loading && products.length === 0 && (
            <div className="text-center py-10 text-sm text-[#7A6A6E]">
              No catalog products found.
            </div>
          )}
        </div>
      </div>

      {/* Immutable Audit Ledger */}
      <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#38131E]">
          <ArrowDownUp size={17} />
          <h2 className="font-serif text-xl">Recent Stock Movements</h2>
        </div>

        {movements.length === 0 ? (
          <p className="text-sm text-[#7A6A6E]">
            No inventory ledger events recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-[#38131E]/10 text-sm">
            {movements.map((m) => (
              <div
                key={m._id}
                className="py-3 flex flex-wrap items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={14} className="text-[#D4AF63]" />
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F7F1E5] text-[#38131E]">
                    {m.type}
                  </span>
                  <span className="font-medium text-[#1A1718]">
                    {m.productCode || m.productId}
                  </span>
                  <span className="text-xs text-[#7A6A6E]">{m.reason}</span>
                </div>
                <div className="text-xs font-mono text-[#5C4E52] flex items-center gap-3">
                  <span>OnHand: {m.quantityDeltaOnHand >= 0 ? `+${m.quantityDeltaOnHand}` : m.quantityDeltaOnHand}</span>
                  <span>Reserved: {m.quantityDeltaReserved >= 0 ? `+${m.quantityDeltaReserved}` : m.quantityDeltaReserved}</span>
                  <span className="uppercase">{m.channel}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
