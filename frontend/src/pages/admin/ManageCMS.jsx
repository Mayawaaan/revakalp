import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Sparkles,
  Upload,
  Eye,
  MousePointerClick,
  Megaphone,
  PauseCircle,
  PlayCircle,
  Loader2,
} from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";
import AdminModal from "../../components/admin/AdminModal";
import { prepareImageForUpload } from "../../utils/imageUpload";

const SLOT_OPTIONS = [
  { value: "announcement_bar", label: "Top Announcement Bar (Sitewide)" },
  { value: "home_hero", label: "Home Hero Banner Override" },
  { value: "promo_banner", label: "Home Mid-Page Promo / Ad Banner" },
  { value: "promo_popup", label: "Storefront Promotional Popup Ad" },
  { value: "shop_strip", label: "Shop & Collection Offer Strip" },
  { value: "collection_portal", label: "Collection Portal Spotlight" },
  { value: "saree_story", label: "Saree Story Slot" },
  { value: "printed_tees", label: "Printed Tees Banner" },
];

const EMPTY_FORM = {
  slot: "promo_banner",
  campaignType: "ad",
  badgeText: "LIMITED OFFER",
  title: "",
  subtitle: "",
  ctaLabel: "Shop Now",
  destinationRoute: "/shop",
  couponCode: "",
  desktopImage: "/campaign/hero-editorial-1600.jpg",
  mobileImage: "/campaign/hero-editorial-800.jpg",
  altText: "",
  assetOrigin: "owner_supplied",
  status: "published",
  priority: 10,
  startsAt: "",
  endsAt: "",
};

const toLocalInput = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function ManageCMS() {
  const showToast = useStore((s) => s.showToast);
  const fetchActiveCampaigns = useStore((s) => s.fetchActiveCampaigns);

  const [campaigns, setCampaigns] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [slotFilter, setSlotFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [cmsRes, couponsRes] = await Promise.all([
        axios.get("/api/admin/cms"),
        axios.get("/api/admin/coupons").catch(() => ({ data: [] })),
      ]);
      setCampaigns(Array.isArray(cmsRes.data) ? cmsRes.data : []);
      setCoupons(Array.isArray(couponsRes.data) ? couponsRes.data : []);
    } catch {
      showToast("Failed to load campaigns & ads", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(() => {
    const activeCount = campaigns.filter((c) => c.status === "published").length;
    const impressions = campaigns.reduce(
      (sum, c) => sum + (Number(c.impressions) || 0),
      0
    );
    const clicks = campaigns.reduce((sum, c) => sum + (Number(c.clicks) || 0), 0);
    const ctr =
      impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : "0.0";
    return { activeCount, impressions, clicks, ctr };
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    if (slotFilter === "All") return campaigns;
    return campaigns.filter((c) => c.slot === slotFilter);
  }, [campaigns, slotFilter]);

  const handleCreativeUpload = async (field, file) => {
    if (!file) return;
    setUploadingField(field);
    try {
      const { file: prepared } = await prepareImageForUpload(file);
      const fd = new FormData();
      fd.append("image", prepared);
      const res = await axios.post("/api/admin/media/upload", fd);
      const url = res.data?.secure_url || "";
      if (url) {
        setForm((prev) => ({
          ...prev,
          [field]: url,
          ...(field === "desktopImage" && !prev.mobileImage ? { mobileImage: url } : {}),
        }));
        showToast("Ad creative uploaded", "success");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || "Image upload failed", "error");
    } finally {
      setUploadingField("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        priority: Number(form.priority) || 10,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : "",
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : "",
      };

      if (editing) {
        await axios.put(`/api/admin/cms/${editing._id}`, payload);
        showToast("Campaign / Ad updated", "success");
      } else {
        await axios.post("/api/admin/cms", payload);
        showToast("Campaign / Ad launched", "success");
      }
      setModalOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      await fetchData();
      fetchActiveCampaigns?.();
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to save campaign", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggleStatus = async (c) => {
    const nextStatus = c.status === "published" ? "retired" : "published";
    try {
      await axios.put(`/api/admin/cms/${c._id}`, { status: nextStatus });
      showToast(
        nextStatus === "published" ? "Campaign is now live" : "Campaign paused",
        "success"
      );
      await fetchData();
      fetchActiveCampaigns?.();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this campaign / ad permanently?")) return;
    try {
      await axios.delete(`/api/admin/cms/${id}`);
      showToast("Campaign removed", "success");
      await fetchData();
      fetchActiveCampaigns?.();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const openEditModal = (c) => {
    setEditing(c);
    setForm({
      slot: c.slot || "promo_banner",
      campaignType: c.campaignType || "campaign",
      badgeText: c.badgeText || "",
      title: c.title || "",
      subtitle: c.subtitle || "",
      ctaLabel: c.ctaLabel || "",
      destinationRoute: c.destinationRoute || "/shop",
      couponCode: c.couponCode || "",
      desktopImage: c.desktopImage || "",
      mobileImage: c.mobileImage || "",
      altText: c.altText || "",
      assetOrigin: c.assetOrigin || "owner_supplied",
      status: c.status || "draft",
      priority: c.priority ?? 10,
      startsAt: toLocalInput(c.startsAt),
      endsAt: toLocalInput(c.endsAt),
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#7A6A6E] mb-1 font-medium">
            Storefront Growth &amp; Merchandising
          </p>
          <h1 className="text-3xl font-serif text-[#38131E]">
            Campaigns &amp; Ads Studio
          </h1>
          <p className="text-sm text-[#5C4E52] mt-1">
            Launch announcements, homepage banners, shop strips, promo popups, and coupon campaigns with live analytics.
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
          <Plus size={15} /> Create Campaign / Ad
        </button>
      </div>

      {/* Live Performance Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#38131E]/14 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
            Live Campaigns
          </p>
          <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
            {stats.activeCount} / {campaigns.length}
          </p>
        </div>
        <div className="bg-white border border-[#38131E]/14 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
            Ad Impressions
          </p>
          <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
            {stats.impressions.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white border border-[#38131E]/14 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
            Ad Clicks
          </p>
          <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
            {stats.clicks.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-white border border-[#38131E]/14 rounded-2xl p-4 shadow-xs">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
            Click-Through Rate
          </p>
          <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
            {stats.ctr}%
          </p>
        </div>
      </div>

      {/* Placement Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSlotFilter("All")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
            slotFilter === "All"
              ? "bg-[#38131E] text-[#F1D889] border-[#38131E]"
              : "bg-white text-[#38131E] border-[#38131E]/18"
          }`}
        >
          All Placements ({campaigns.length})
        </button>
        {SLOT_OPTIONS.map((opt) => {
          const count = campaigns.filter((c) => c.slot === opt.value).length;
          if (count === 0) return null;
          const active = slotFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSlotFilter(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                active
                  ? "bg-[#38131E] text-[#F1D889] border-[#38131E]"
                  : "bg-white text-[#38131E] border-[#38131E]/18"
              }`}
            >
              {opt.label.split(" (")[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {!loading && filteredCampaigns.length === 0 && (
          <div className="col-span-full bg-white/95 border border-[#38131E]/15 rounded-2xl p-10 text-center text-[#7A6A6E] space-y-2">
            <Megaphone className="w-8 h-8 mx-auto text-[#D4AF63]" />
            <p className="font-medium text-[#38131E]">
              No active campaigns or ads configured in this placement yet.
            </p>
            <p className="text-xs">
              Click &ldquo;Create Campaign / Ad&rdquo; above to run banners, announcements, or popups across the live store.
            </p>
          </div>
        )}

        {filteredCampaigns.map((c) => {
          const ctr =
            c.impressions > 0
              ? ((Number(c.clicks || 0) / Number(c.impressions)) * 100).toFixed(1)
              : "0.0";
          const isLive = c.status === "published";
          return (
            <div
              key={c._id}
              className="bg-white/95 border border-[#38131E]/15 rounded-2xl overflow-hidden shadow-sm flex flex-col"
            >
              {c.desktopImage && (
                <div className="aspect-[16/9] bg-[#2B0E17] overflow-hidden relative">
                  <img
                    src={c.desktopImage}
                    alt={c.altText || c.title}
                    className="w-full h-full object-cover"
                  />
                  {c.badgeText && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-[#D4AF63] text-[#2B0E17] text-[10px] font-bold uppercase tracking-wider">
                      {c.badgeText}
                    </span>
                  )}
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F7F1E5] text-[#38131E] border border-[#38131E]/12">
                      {c.slot} · {c.campaignType || "campaign"}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                        isLive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-[#38131E]">{c.title}</h3>
                  {c.subtitle && (
                    <p className="text-xs text-[#5C4E52] mt-1 line-clamp-2">
                      {c.subtitle}
                    </p>
                  )}

                  {c.couponCode && (
                    <p className="mt-2 inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EFE6D5] text-[#38131E] border border-[#D4AF63]/40">
                      Coupon: {c.couponCode}
                    </p>
                  )}
                </div>

                {/* Impressions / Clicks Strip */}
                <div className="flex items-center justify-between text-[11px] text-[#5C4E52] bg-[#FBF7EE] px-3 py-2 rounded-xl border border-[#38131E]/10">
                  <span className="inline-flex items-center gap-1">
                    <Eye size={12} className="text-[#9A7A3A]" /> {c.impressions || 0}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MousePointerClick size={12} className="text-[#9A7A3A]" />{" "}
                    {c.clicks || 0}
                  </span>
                  <span className="font-mono font-semibold text-[#38131E]">
                    {ctr}% CTR
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#38131E]/10 text-xs">
                  <button
                    type="button"
                    onClick={() => openEditModal(c)}
                    className="inline-flex items-center gap-1 text-[#38131E] font-medium hover:underline cursor-pointer"
                  >
                    <Sparkles size={13} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickToggleStatus(c)}
                    className="inline-flex items-center gap-1 text-[#38131E] font-medium hover:underline cursor-pointer"
                  >
                    {isLive ? (
                      <>
                        <PauseCircle size={13} /> Pause
                      </>
                    ) : (
                      <>
                        <PlayCircle size={13} /> Publish
                      </>
                    )}
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
          );
        })}
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Campaign / Ad Slot" : "Create Campaign / Ad Slot"}
        subtitle="Supported image creatives: JPG, PNG, WEBP, AVIF · max 15 MB"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#38131E]/70 font-semibold mb-1">
                  Placement Slot
                </label>
                <select
                  value={form.slot}
                  onChange={(e) => setForm({ ...form, slot: e.target.value })}
                  className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  {SLOT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#38131E]/70 font-semibold mb-1">
                  Format Type
                </label>
                <select
                  value={form.campaignType}
                  onChange={(e) =>
                    setForm({ ...form, campaignType: e.target.value })
                  }
                  className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="campaign">Brand Campaign</option>
                  <option value="ad">Promotional Ad</option>
                  <option value="announcement">Announcement Strip</option>
                  <option value="popup">Popup Modal Ad</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#38131E]/70 font-semibold mb-1">
                  Publish Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  <option value="published">Published (Live)</option>
                  <option value="scheduled">Scheduled (Timed)</option>
                  <option value="draft">Draft</option>
                  <option value="retired">Paused / Retired</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                placeholder="Badge (e.g. FESTIVE SALE)"
                value={form.badgeText}
                onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
              />
              <input
                required
                placeholder="Headline Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="sm:col-span-2 border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Subtitle / offer copy"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                placeholder="CTA Label (e.g. Shop Sarees)"
                value={form.ctaLabel}
                onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
              />
              <input
                placeholder="Destination (/shop/saree/all)"
                value={form.destinationRoute}
                onChange={(e) =>
                  setForm({ ...form, destinationRoute: e.target.value })
                }
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm"
              />
              <input
                list="rk-coupon-suggestions"
                placeholder="Attach Coupon Code (optional)"
                value={form.couponCode}
                onChange={(e) =>
                  setForm({ ...form, couponCode: e.target.value.toUpperCase() })
                }
                className="border border-[#38131E]/20 rounded-xl px-3 py-2 text-sm font-mono uppercase"
              />
              <datalist id="rk-coupon-suggestions">
                {coupons
                  .filter((cp) => cp.isActive)
                  .map((cp) => (
                    <option key={cp._id} value={cp.code}>
                      {cp.discountPercentage}% off
                    </option>
                  ))}
              </datalist>
            </div>

            {/* Built-in Direct Ad Creative Uploaders (Desktop & Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FBF7EE] border border-[#38131E]/12">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-[#38131E]/75 font-semibold">
                  Desktop Banner Creative
                </p>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Desktop Image URL"
                    value={form.desktopImage}
                    onChange={(e) =>
                      setForm({ ...form, desktopImage: e.target.value })
                    }
                    className="flex-1 border border-[#38131E]/20 rounded-xl px-3 py-1.5 text-xs bg-white"
                  />
                  <label className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#38131E] text-[#F1D889] text-xs font-medium cursor-pointer">
                    {uploadingField === "desktopImage" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Upload size={12} />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleCreativeUpload("desktopImage", e.target.files?.[0])
                      }
                      className="hidden"
                    />
                  </label>
                </div>
                {form.desktopImage && (
                  <img
                    src={form.desktopImage}
                    alt="Desktop preview"
                    className="h-20 w-full object-cover rounded-lg border border-[#38131E]/15"
                  />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-[#38131E]/75 font-semibold">
                  Mobile Creative (Optional)
                </p>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Mobile Image URL"
                    value={form.mobileImage}
                    onChange={(e) =>
                      setForm({ ...form, mobileImage: e.target.value })
                    }
                    className="flex-1 border border-[#38131E]/20 rounded-xl px-3 py-1.5 text-xs bg-white"
                  />
                  <label className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#38131E] text-[#F1D889] text-xs font-medium cursor-pointer">
                    {uploadingField === "mobileImage" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Upload size={12} />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleCreativeUpload("mobileImage", e.target.files?.[0])
                      }
                      className="hidden"
                    />
                  </label>
                </div>
                {form.mobileImage && (
                  <img
                    src={form.mobileImage}
                    alt="Mobile preview"
                    className="h-20 w-full object-cover rounded-lg border border-[#38131E]/15"
                  />
                )}
              </div>
            </div>

            {/* Schedule & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#38131E]/70 font-semibold mb-1">
                  Start Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                  className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#38131E]/70 font-semibold mb-1">
                  End Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                  className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#38131E]/70 font-semibold mb-1">
                  Priority
                </label>
                <input
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full border border-[#38131E]/20 rounded-xl px-3 py-2 text-xs bg-white"
                />
              </div>
            </div>

            <input
              placeholder="Alt Text & Accessibility Description"
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
                disabled={saving}
                className="rk-admin-btn bg-[#38131E] text-[#F7F1E5] px-6 py-2 rounded-full text-sm font-medium border border-[#D4AF63]/40 cursor-pointer disabled:opacity-50"
              >
                {saving ? "Saving…" : editing ? "Update Campaign" : "Launch Campaign"}
              </button>
            </div>
          </form>
      </AdminModal>
    </div>
  );
}
