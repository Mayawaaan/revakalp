import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";
import PageHero from "../../components/globalComponents/PageHero";
import EditorialButton from "../../components/ui/EditorialButton";
import { useSeoMeta } from "../../utils/seo";

const CATEGORIES = [
  { value: "order_delivery", label: "Order & Delivery" },
  { value: "return_refund", label: "Returns & Refunds" },
  { value: "payment_billing", label: "Payment & Billing" },
  { value: "product_quality", label: "Product Description / Quality" },
  { value: "privacy_dpdpa", label: "Privacy / DPDPA Data Request" },
  { value: "other", label: "Other" },
];

const inputCls =
  "w-full min-h-[46px] px-4 py-2.5 rounded-[2px] border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-1 focus:ring-[#D4AF63]";

export default function GrievanceRedressal() {
  const { settings, user, showToast } = useStore();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    orderNumber: "",
    category: "order_delivery",
    subject: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const officerName = settings?.grievanceOfficerName?.trim() || "Anjali Katare";
  const officerRole =
    settings?.grievanceOfficerDesignation?.trim() ||
    "Founder & Grievance Redressal Officer";
  const officerEmail =
    settings?.grievanceOfficerEmail?.trim() ||
    settings?.supportEmail?.trim() ||
    "contact@revakalp.com";
  const officerPhone =
    settings?.grievanceOfficerPhone?.trim() ||
    settings?.phone?.trim() ||
    "+91 91096-76562";
  const address =
    settings?.address?.trim() ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012";

  useSeoMeta({
    title: "Grievance Redressal",
    description:
      "Statutory Grievance Redressal mechanism under Consumer Protection (E-Commerce) Rules, 2020, IT Rules, 2021, and DPDPA 2023.",
    canonicalPath: "/grievance-redressal",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/compliance/grievance", formData);
      setReceipt(data);
      showToast?.("Grievance logged successfully", "success");
    } catch (error) {
      showToast?.(
        error?.response?.data?.message || "Unable to submit grievance right now",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Statutory Redressal"
        title="Grievance Redressal"
        subtitle="Appointed customer and data privacy grievance desk under the Consumer Protection (E-Commerce) Rules, 2020 and DPDPA 2023."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {/* Statutory SLA + Officer Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rk-surface-card p-6 sm:p-8 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/65 font-semibold">
              Designated Officer
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
              {officerName}
            </h2>
            <p className="text-sm text-[#1A1718]/75">{officerRole}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-[#1A1718]/85">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/60 font-semibold">
                  Email
                </p>
                <a
                  href={`mailto:${officerEmail}`}
                  className="text-[#38131E] font-medium underline break-all"
                >
                  {officerEmail}
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/60 font-semibold">
                  Phone / WhatsApp
                </p>
                <p>{officerPhone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/60 font-semibold">
                  Store Address &amp; Hours
                </p>
                <p className="leading-relaxed">{address}</p>
                <p className="text-xs text-[#38131E] font-medium mt-1">
                  Monday – Saturday · 10:30 AM – 8:30 PM IST
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] p-6 border border-[#D4AF63]/40 flex flex-col justify-center">
              <p className="font-serif text-3xl text-[#F1D889]">48 Hours</p>
              <p className="text-xs text-[#F7F1E5]/80 mt-1">
                Mandatory acknowledgment with a unique ticket ID under E-Commerce Rules, 2020.
              </p>
            </div>
            <div className="rounded-[2px] bg-[#EFE6D5] text-[#1A1718] p-6 border border-[#38131E]/18 flex flex-col justify-center">
              <p className="font-serif text-3xl text-[#38131E]">30 Days</p>
              <p className="text-xs text-[#1A1718]/75 mt-1">
                Target closure window for consumer and data protection complaints.
              </p>
            </div>
          </div>
        </div>

        {/* Grievance Submission Form */}
        <div className="rk-surface-card p-6 sm:p-10">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E] mb-2">
            Submit a Complaint or Data Request
          </h2>
          <p className="text-sm text-[#1A1718]/75 mb-6">
            Receive an instant reference number and response from our Grievance Redressal desk.
          </p>

          {receipt ? (
            <div className="p-6 rounded-[2px] bg-[#FBF7EE] border border-[#D4AF63] space-y-3">
              <p className="font-semibold text-[#38131E] flex items-center gap-2">
                <Check className="w-5 h-5" /> Grievance Logged
              </p>
              <p className="text-sm text-[#1A1718]/85">
                Ticket ID:{" "}
                <strong className="font-mono text-[#38131E]">{receipt.ticketId}</strong>
              </p>
              <p className="text-xs text-[#1A1718]/75 leading-relaxed">
                {receipt.message}
              </p>
              <button
                type="button"
                onClick={() => {
                  setReceipt(null);
                  setFormData((prev) => ({
                    ...prev,
                    subject: "",
                    description: "",
                    orderNumber: "",
                  }));
                }}
                className="rk-btn-secondary mt-2"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="grv-name" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="grv-name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="grv-email" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="grv-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="grv-phone" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="grv-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="grv-order" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                    Order Number (Optional)
                  </label>
                  <input
                    id="grv-order"
                    name="orderNumber"
                    placeholder="e.g. ORD-..."
                    value={formData.orderNumber}
                    onChange={handleChange}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="grv-cat" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                    Category *
                  </label>
                  <select
                    id="grv-cat"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="grv-subject" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                    Subject *
                  </label>
                  <input
                    id="grv-subject"
                    name="subject"
                    maxLength={200}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="grv-desc" className="block text-xs uppercase tracking-wider text-[#38131E]/75 font-semibold mb-1.5">
                  Complaint Details *
                </label>
                <textarea
                  id="grv-desc"
                  name="description"
                  rows={4}
                  maxLength={3000}
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-4 rounded-[2px] border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-1 focus:ring-[#D4AF63]"
                />
              </div>

              <EditorialButton type="submit" variant="primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting…</span>
                  </>
                ) : (
                  "Submit Grievance"
                )}
              </EditorialButton>
            </form>
          )}
        </div>

        {/* Statutory External Escalation */}
        <div className="rounded-[2px] bg-[#EFE6D5] border border-[#38131E]/15 p-6 sm:p-8 text-sm text-[#1A1718]/80 space-y-2">
          <h2 className="font-serif text-xl text-[#38131E]">
            Further Statutory Escalation
          </h2>
          <p className="leading-relaxed">
            If your concern remains unresolved beyond statutory timelines, you may approach
            the National Consumer Helpline (toll-free <strong className="text-[#38131E]">1915</strong>{" "}
            or{" "}
            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38131E] font-semibold underline"
            >
              consumerhelpline.gov.in
            </a>
            ) or, for personal data matters, the Data Protection Board of India under DPDPA
            2023.
          </p>
        </div>
      </div>
    </div>
  );
}
