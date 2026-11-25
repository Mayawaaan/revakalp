import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, CheckCircle2, Clock, MessageSquareWarning, Save } from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const STATUS_FILTERS = ["All", "open", "acknowledged", "in_progress", "resolved"];

const STATUS_BADGE = {
  open: "bg-red-50 text-red-700 border-red-200",
  acknowledged: "bg-amber-50 text-amber-800 border-amber-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function ManageGrievances() {
  const showToast = useStore((s) => s.showToast);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [notes, setNotes] = useState({});
  const [savingId, setSavingId] = useState("");

  const fetchGrievances = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/grievances");
      const list = Array.isArray(res.data) ? res.data : [];
      setGrievances(list);
      const noteMap = {};
      for (const g of list) {
        noteMap[g._id] = g.adminNote || "";
      }
      setNotes(noteMap);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to fetch grievances", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  const handleUpdate = async (id, nextStatus) => {
    setSavingId(id);
    try {
      const res = await axios.put(`/api/admin/grievances/${id}`, {
        status: nextStatus,
        adminNote: notes[id] ?? "",
      });
      setGrievances((prev) => prev.map((g) => (g._id === id ? res.data : g)));
      showToast("Grievance updated", "success");
    } catch (err) {
      showToast(err?.response?.data?.message || "Update failed", "error");
    } finally {
      setSavingId("");
    }
  };

  const filtered = useMemo(() => {
    if (statusFilter === "All") return grievances;
    return grievances.filter((g) => g.status === statusFilter);
  }, [grievances, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">
            Statutory Compliance
          </p>
          <h1 className="text-3xl font-serif text-[#38131E]">
            Grievances &amp; Customer Tickets
          </h1>
          <p className="text-sm text-[#5C4E52] mt-1">
            Review complaints logged under Indian Consumer Protection SLA (48h ack / 30d resolution)
          </p>
        </div>

        <button
          type="button"
          onClick={fetchGrievances}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-[#38131E]/20 bg-white px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold text-[#38131E] hover:bg-[#F7F1E5] cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => {
          const active = statusFilter === s;
          const count =
            s === "All"
              ? grievances.length
              : grievances.filter((g) => g.status === s).length;
          return (
              <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rk-admin-pill px-3.5 py-1.5 rounded-full text-xs font-medium border cursor-pointer capitalize ${
                active
                  ? "bg-[#38131E] text-[#F1D889] border-[#38131E] shadow-xs"
                  : "bg-white text-[#38131E] border-[#38131E]/18 hover:border-[#D4AF63]"
              }`}
            >
              {s.replace("_", " ")} ({count})
            </button>
          );
        })}
      </div>

      {/* Tickets List */}
      <div key={statusFilter} className="rk-admin-enter space-y-4">
        {!loading && filtered.length === 0 && (
          <div className="bg-white/95 border border-[#38131E]/15 rounded-2xl p-10 text-center text-[#7A6A6E]">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#D4AF63]" />
            No grievances in this filter.
          </div>
        )}

        {filtered.map((g) => (
          <div
            key={g._id}
            className="bg-white/95 border border-[#38131E]/15 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#38131E]/10 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-[#F7F1E5] text-[#38131E] border border-[#38131E]/15">
                    {g.ticketId}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-[#7A6A6E]">
                    {g.category?.replace("_", " ")}
                  </span>
                  {g.orderNumber && (
                    <span className="text-[11px] font-mono text-[#38131E]">
                      Order: {g.orderNumber}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-xl text-[#38131E] mt-1.5 flex items-center gap-2">
                  <MessageSquareWarning size={16} className="text-[#D4AF63] shrink-0" />
                  {g.subject}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                    STATUS_BADGE[g.status] || "bg-[#F7F1E5] text-[#38131E]"
                  }`}
                >
                  {g.status?.replace("_", " ")}
                </span>
                <span className="text-xs text-[#7A6A6E] inline-flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(g.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                </span>
              </div>
            </div>

            <div className="text-sm text-[#1A1718]/85 space-y-1.5">
              <p>{g.description}</p>
              <p className="text-xs text-[#5C4E52]">
                Customer: <strong>{g.fullName}</strong> ({g.email}
                {g.phone ? ` · ${g.phone}` : ""})
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                value={notes[g._id] ?? ""}
                onChange={(e) =>
                  setNotes((prev) => ({ ...prev, [g._id]: e.target.value }))
                }
                placeholder="Internal resolution note / action taken…"
                className="flex-1 border border-[#38131E]/20 rounded-xl px-3.5 py-2 text-xs text-[#1A1718] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
              />

              <select
                value={g.status}
                disabled={savingId === g._id}
                onChange={(e) => handleUpdate(g._id, e.target.value)}
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-xs font-medium bg-white text-[#38131E]"
              >
                <option value="open">Open</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <button
                type="button"
                disabled={savingId === g._id}
                onClick={() => handleUpdate(g._id, g.status)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#38131E] text-[#F7F1E5] hover:bg-[#2B0E17] text-xs font-medium cursor-pointer disabled:opacity-50"
              >
                <Save size={13} /> Save Note
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
