import React from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/store";
import PageHero from "../../components/globalComponents/PageHero";
import EditorialButton from "../../components/ui/EditorialButton";
import { useSeoMeta } from "../../utils/seo";

const Returns = () => {
  const settings = useStore((s) => s.settings);
  const supportEmail = settings?.supportEmail?.trim() || "contact@revakalp.com";
  const phone = settings?.phone?.trim() || "+91 91096-76562";

  useSeoMeta({
    title: "Returns, Exchanges & Cancellations",
    description:
      "Revakalp 7-day return, exchange, cancellation, and refund policy in line with Consumer Protection (E-Commerce) Rules, 2020.",
    canonicalPath: "/returns-exchanges",
  });

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Consumer Protection Policy"
        title="Returns, Exchanges & Cancellations"
        subtitle="Clear rules for cancelling an order, requesting a return or exchange, and receiving refunds."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <div className="rk-surface-card p-6 border-[#D4AF63]/60">
          <p className="font-serif text-xl text-[#38131E] mb-1">7-Day Return Window</p>
          <p className="text-sm text-[#1A1718]/75">
            Please reach out within 7 days of delivery with original tags attached and a clear,
            continuous unboxing video.
          </p>
        </div>

        <div className="rk-surface-card p-6 sm:p-10 md:p-12 divide-y divide-[#38131E]/10">
          <div className="pb-6">
            <h2 className="font-serif text-2xl text-[#38131E] mb-3">
              Cancelling Before Dispatch
            </h2>
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              You may request an order cancellation before your parcel leaves our Indore store by
              emailing{" "}
              <a href={`mailto:${supportEmail}`} className="text-[#38131E] font-semibold underline">
                {supportEmail}
              </a>{" "}
              or calling <strong className="text-[#38131E]">{phone}</strong> with your order ID.
              No cancellation fee applies prior to dispatch, and any prepaid amount is refunded in
              full to your original payment method.
            </p>
          </div>

          <div className="py-6">
            <h2 className="font-serif text-2xl text-[#38131E] mb-3">
              What&apos;s Eligible for Return or Exchange
            </h2>
            <p className="text-sm text-[#1A1718]/80 mb-2">
              Orders may be returned or exchanged within{" "}
              <strong className="text-[#38131E]">7 days</strong> of delivery provided the item:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1A1718]/80">
              <li>Is unworn, unwashed, and unaltered</li>
              <li>Has original tags, labels, and packaging intact</li>
              <li>Has no stains, perfume, or post-delivery damage</li>
              <li>Is supported by a continuous, unedited 360-degree unboxing video</li>
            </ul>
          </div>

          <div className="py-6">
            <h2 className="font-serif text-2xl text-[#38131E] mb-3">
              Defective, Damaged, or Wrong Items
            </h2>
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              In compliance with the Consumer Protection (E-Commerce) Rules, 2020, if an item
              arrives damaged, defective, materially different from its description, or incorrectly
              sent, we gladly accept a replacement or full refund upon sharing your unboxing video —
              even if the item was purchased on discount.
            </p>
          </div>

          <div className="py-6">
            <h2 className="font-serif text-2xl text-[#38131E] mb-3">Items Not Eligible</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1A1718]/80">
              <li>Custom-stitched, tailored, or fall/pico altered garments</li>
              <li>Clearance or final-sale items (except where delivered damaged or incorrect)</li>
            </ul>
          </div>

          <div className="py-6">
            <h2 className="font-serif text-2xl text-[#38131E] mb-4">How to Request a Return</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-[#1A1718]/80 leading-relaxed">
              <li>Email {supportEmail} within 7 days of delivery with your order ID, reason, and continuous unboxing video.</li>
              <li>Our Indore team reviews every request within 24–48 hours.</li>
              <li>Once approved, we coordinate return pickup or shipping instructions.</li>
            </ol>
          </div>

          <div className="py-6">
            <h2 className="font-serif text-2xl text-[#38131E] mb-2">Refunds &amp; Exchanges</h2>
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              Once the returned item reaches our store and passes quality inspection, prepaid
              refunds are initiated within{" "}
              <strong className="text-[#38131E]">7–10 business days</strong> to your original
              payment method. Eligible Cash on Delivery refunds are transferred via UPI or bank
              transfer after confirming your details.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#1A1718]/75">
              Unresolved issue? Escalate via our{" "}
              <Link to="/grievance-redressal" className="text-[#38131E] font-semibold underline">
                Grievance Redressal
              </Link>{" "}
              desk.
            </p>
            <EditorialButton to="/contact" variant="primary">
              Contact Us
            </EditorialButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
