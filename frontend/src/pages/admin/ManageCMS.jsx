import React, { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Sparkles, X } from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const EMPTY_FORM = {
  slot: "home_hero",
  title: "",
  subtitle: "",
  ctaLabel: "Explore Collections",
  destinationRoute: "/shop",
  desktopImage: "/campaign/hero-editorial-1600.jpg",
  mobileImage: "/campaign/hero-editorial-800.jpg",
  altText: "",
  assetOrigin: "owner_supplied",
  status: "draft",
};

export default function ManageCMS() {
  const showToast = useStore((s) => s.showToast);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/cms");
      setCampaigns(res.data || []);
    } catch {
      showToast("Failed to load CMS campaigns", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/admin/cms/${editing._id}`, form);
        showToast("Campaign updated", "success");
      } else {
        await axios.post("/api/admin/cms", form);
        showToast("Campaign created", "success");
      }
      setModalOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      await fetchCampaigns();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to save campaign", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this campaign slot?")) return;
    try {
      await axios.delete(`/api/admin/cms/${id}`);
      showToast("Campaign deleted", "success");
      await fetchCampaigns();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#7A6A6E] mb-1 font-medium">
            Merchandising Studio
          </p>
          <h1 className="text-3xl font-serif text-[#38131E]">Content &amp; Campaigns</h1>
          <p className="text-sm text-[#5C4E52] mt-1">
            Publish, schedule, or roll back storefront campaign slots without editing code.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setForm(EMPTY_FORM);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#38131E] hover:bg-[#2B0E17] text-[#F7F1E5] px-5 py-2.5 rounded-full text-sm font-medium border border-[#D4AF63]/40 cursor-pointer"
        >
          <Plus size={15} /> Add Campaign Slot
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {!loading && campaigns.length === 0 && (
          <div className="col-span-full bg-white/95 border border-[#38131E]/15 rounded-2xl p-10 text-center text-[#7A6A6E]">
            No CMS campaign overrides configured yet. Default editorial campaign assets remain active.
          </div>
        )}

        {campaigns.map((c) => (
          <div
            key={c._id}
            className="bg-white/95 border border-[#38131E]/15 rounded-2xl overflow-hidden shadow-sm flex flex-col"
          >
            {c.desktopImage && (
              <div className="aspect-[16/9] bg-[#2B0E17] overflow-hidden">
                <img
                  src={c.desktopImage}
                  alt={c.altText || c.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F7F1E5] text-[#38131E]">
                    {c.slot} · v{c.version || 1}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9A7A3A]">
                    {c.status}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#38131E]">{c.title}</h3>
                {c.subtitle && (
                  <p className="text-xs text-[#5C4E52] mt-1 line-clamp-2">{c.subtitle}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#38131E]/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(c);
                    setForm({
                      slot: c.slot,
                      title: c.title,
                      subtitle: c.subtitle || "",
                      ctaLabel: c.ctaLabel || "",
                      destinationRoute: c.destinationRoute || "/shop",
                      desktopImage: c.desktopImage || "",
                      mobileImage: c.mobileImage || "",
                      altText: c.altText || "",
                      assetOrigin: c.assetOrigin || "owner_supplied",
                      status: c.status || "draft",
                    });
                    setModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-[#38131E] font-medium hover:underline cursor-pointer"
                >
                  <Sparkles size={13} /> Edit / Publish
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c._id)}
                  className="text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[#1A1718]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl border border-[#38131E]/15 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[#7A6A6E] hover:text-[#38131E] cursor-pointer"
            >
              <X size={18} />
            </button>
            <h2 className="font-serif text-xl text-[#38131E]">
              {editing ? "Edit Campaign Slot" : "New Campaign Slot"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={form.slot}
                onChange={(e) => setForm({ ...form, slot: e.target.value })}
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
              >
                <option value="home_hero">home_hero</option>
                <option value="collection_portal">collection_portal</option>
                <option value="saree_story">saree_story</option>
                <option value="printed_tees">printed_tees</option>
              </select>

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
              >
                <option value="draft">draft</option>
                <option value="in_review">in_review</option>
                <option value="scheduled">scheduled</option>
                <option value="published">published</option>
                <option value="retired">retired</option>
              </select>
            </div>

            <input
              required
              placeholder="Headline Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
            />

            <textarea
              rows={2}
              placeholder="Subtitle / editorial copy"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="CTA Label"
                value={form.ctaLabel}
                onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
              />
              <input
                placeholder="Destination Route (/shop/...)"
                value={form.destinationRoute}
                onChange={(e) => setForm({ ...form, destinationRoute: e.target.value })}
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <input
              placeholder="Desktop Image URL"
              value={form.desktopImage}
              onChange={(e) => setForm({ ...form, desktopImage: e.target.value })}
              className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
            />

            <input
              placeholder="Alt Text &amp; Rights Note"
              value={form.altText}
              onChange={(e) => setForm({ ...form, altText: e.target.value })}
              className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-sm text-[#5C4E52] px-4 py-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#38131E] text-[#F7F1E5] px-6 py-2 rounded-full text-sm font-medium border border-[#D4AF63]/40 cursor-pointer"
              >
                {editing ? "Update Slot" : "Save Draft"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
