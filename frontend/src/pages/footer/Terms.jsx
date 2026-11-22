import React from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/store";
import PageHero from "../../components/globalComponents/PageHero";
import { useSeoMeta } from "../../utils/seo";

const PolicySection = ({ title, children }) => (
  <div className="pb-8 mb-8 border-b border-[#38131E]/10 last:border-0 last:pb-0 last:mb-0">
    <h2 className="font-serif text-2xl text-[#38131E] mb-3">{title}</h2>
    {children}
  </div>
);

const Terms = () => {
  const settings = useStore((s) => s.settings);
  const legalName = settings?.legalEntityName?.trim() || "Revakalp";
  const address =
    settings?.address?.trim() ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012";
  const supportEmail = settings?.supportEmail?.trim() || "contact@revakalp.com";

  useSeoMeta({
    title: "Terms & Conditions",
    description:
      "Terms of use and sale governing purchases on Revakalp under the Indian Contract Act, IT Act, and Consumer Protection (E-Commerce) Rules, 2020.",
    canonicalPath: "/terms-conditions",
  });

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Store Terms"
        title="Terms & Conditions"
        subtitle="Clear expectations when you browse or purchase from Revakalp."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="inline-block bg-[#FBF7EE] border border-[#38131E]/15 rounded-[2px] px-4 py-1.5 mb-8 text-xs text-[#38131E]">
          Last updated: November 2026
        </div>

        <div className="rk-surface-card p-6 sm:p-10 md:p-12">
          <PolicySection title="Electronic Record & Eligibility">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              This document is an electronic record under the Information Technology Act, 2000
              and does not require physical or digital signatures. By browsing or ordering
              from <strong className="text-[#38131E]">{legalName}</strong> ({address}), you
              confirm that you are at least 18 years old and legally competent to enter into
              a contract under the Indian Contract Act, 1872.
            </p>
          </PolicySection>

          <PolicySection title="Single-Seller Inventory & Product Descriptions">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              {legalName} operates as a curated single-seller retail store in Indore. We aim
              to represent colors, fabrics, and measurements faithfully; slight variations in
              hue or texture can occur due to lighting, photography, and individual screen
              calibrations.
            </p>
          </PolicySection>

          <PolicySection title="Pricing, Taxes & Live Availability">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes
              (GST) unless stated otherwise, with shipping calculated transparently at checkout.
              Because many garments are kept in limited or single-piece quantities across our
              website and Indore boutique, an order is subject to live stock confirmation at
              checkout. If an item becomes unavailable simultaneously in store, we cancel and
              refund that item promptly.
            </p>
          </PolicySection>

          <PolicySection title="Payments & Order Acceptance">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              Please verify your shipping address and phone number carefully before ordering.
              Online payments are processed through Razorpay and confirmed via server
              verification; Cash on Delivery is offered subject to availability at checkout. We
              reserve the right to cancel orders showing suspected fraud, pricing errors, or
              incomplete delivery details.
            </p>
          </PolicySection>

          <PolicySection title="Delivery, Cancellations & Returns">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              Shipping timelines, cancellation windows, our 7-day return &amp; exchange policy
              (including the continuous unboxing video requirement), and protections for
              defective or incorrect items are detailed on our{" "}
              <Link to="/delivery-information" className="text-[#38131E] font-semibold underline">
                Delivery Information
              </Link>{" "}
              and{" "}
              <Link to="/returns-exchanges" className="text-[#38131E] font-semibold underline">
                Returns &amp; Cancellations
              </Link>{" "}
              pages.
            </p>
          </PolicySection>

          <PolicySection title="Intellectual Property & Acceptable Use">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              The REVAKALP name, crossing-thread wordmark, photography, 3D visuals, and
              written copy belong to {legalName} or its licensors and may not be copied,
              scraped, or used commercially without written permission. Attempting to probe,
              tamper with, or disrupt site security is strictly prohibited.
            </p>
          </PolicySection>

          <PolicySection title="Limitation of Liability & Force Majeure">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              To the extent permitted by Indian law, {legalName}&apos;s maximum aggregate
              liability for any order-related claim is limited to the price paid for the
              relevant order. We are not liable for delays caused by events beyond reasonable
              control, including transport disruptions, natural calamities, or network outages.
            </p>
          </PolicySection>

          <PolicySection title="Governing Law & Grievance Redressal">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              These Terms are governed by the laws of India, with exclusive jurisdiction vested
              in the competent courts at <strong className="text-[#38131E]">Indore, Madhya Pradesh</strong>.
              If you have a complaint, please contact our{" "}
              <Link to="/grievance-redressal" className="text-[#38131E] font-semibold underline">
                Grievance Redressal Officer
              </Link>{" "}
              before further escalation.
            </p>
          </PolicySection>

          <div className="mt-8 p-6 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12 text-center text-sm">
            Questions? Write to{" "}
            <a href={`mailto:${supportEmail}`} className="text-[#38131E] font-semibold underline">
              {supportEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
