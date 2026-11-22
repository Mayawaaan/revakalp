import React from "react";
import { Clock } from "lucide-react";
import PageHero from "../../components/globalComponents/PageHero";
import EditorialButton from "../../components/ui/EditorialButton";

const Returns = () => (
  <div className="bg-[#F7F1E5] text-[#1A1718]">
    <PageHero
      label="Customer Care"
      title="Returns & Exchanges"
      subtitle="Clear, transparent return and exchange terms for your Revakalp orders."
    />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <div className="rk-surface-card p-6 flex items-center gap-4 border-[#D4AF63]/60">
        <div className="w-12 h-12 rounded-full bg-[#38131E] text-[#F1D889] flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="font-serif text-xl text-[#38131E]">7-Day Return Window</p>
          <p className="text-sm text-[#1A1718]/75">
            Return or exchange requests must be raised within 7 days of delivery with a
            clear, continuous unboxing video.
          </p>
        </div>
      </div>

      <div className="rk-surface-card p-6 sm:p-10 md:p-12 divide-y divide-[#38131E]/10">
        <div className="pb-6">
          <h2 className="font-serif text-2xl text-[#38131E] mb-3">Return Eligibility</h2>
          <p className="text-sm text-[#1A1718]/80 mb-2">
            You may request a return or exchange within{" "}
            <strong className="text-[#38131E]">7 days</strong> of delivery, provided the product:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1A1718]/80">
            <li>Is unused, unwashed, and unaltered</li>
            <li>Has original tags and packaging intact</li>
            <li>Is free from damage, stains, or odors</li>
            <li>Is accompanied by a continuous, unedited unboxing video</li>
          </ul>
        </div>

        <div className="py-6">
          <h2 className="font-serif text-2xl text-[#38131E] mb-3">Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1A1718]/80">
            <li>Customized or stitched garments</li>
            <li>Clearance or sale items</li>
            <li>Products marked as &ldquo;Final Sale&rdquo;</li>
          </ul>
        </div>

        <div className="py-6">
          <h2 className="font-serif text-2xl text-[#38131E] mb-4">How to Initiate a Return</h2>
          <div className="space-y-3">
            {[
              "Email us at contact@revakalp.com with your order ID, reason for return, and continuous unboxing video.",
              "Our team will review your request within 24–48 hours and confirm eligibility.",
              "Once approved, we will guide you through pickup or return shipping.",
            ].map((stepText, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#38131E] text-[#F1D889] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm text-[#1A1718]/80 leading-relaxed">{stepText}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="py-6">
          <h2 className="font-serif text-2xl text-[#38131E] mb-2">Refunds &amp; Exchanges</h2>
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            After we receive and inspect the returned product, eligible refunds are processed
            within <strong className="text-[#38131E]">7–10 business days</strong> to your
            original payment method. Exchanges are subject to product availability.
          </p>
        </div>

        <div className="pt-6 text-center">
          <p className="text-sm text-[#1A1718]/75 mb-4">
            Need help with a return or exchange?
          </p>
          <EditorialButton to="/contact" variant="primary">
            Contact Support
          </EditorialButton>
        </div>
      </div>
    </div>
  </div>
);

export default Returns;
