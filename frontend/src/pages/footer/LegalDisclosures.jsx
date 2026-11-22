import React from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/store";
import PageHero from "../../components/globalComponents/PageHero";
import { useSeoMeta } from "../../utils/seo";

const LegalDisclosures = () => {
  const settings = useStore((s) => s.settings);
  const legalName = settings?.legalEntityName?.trim() || "Revakalp";
  const gstin = settings?.gstin?.trim();
  const address =
    settings?.address?.trim() ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012";
  const supportEmail = settings?.supportEmail?.trim() || "contact@revakalp.com";
  const phone = settings?.phone?.trim() || "+91 91096-76562";
  const officerName = settings?.grievanceOfficerName?.trim() || "Anjali Katare";
  const officerEmail = settings?.grievanceOfficerEmail?.trim() || supportEmail;
  const originCountry = settings?.countryOfOriginDefault?.trim() || "India";

  useSeoMeta({
    title: "Legal Disclosures & Security",
    description:
      "Seller identity, Consumer Protection (E-Commerce) Rules disclosures, security practices, and legal policies for Revakalp Indore.",
    canonicalPath: "/legal-compliance",
  });

  const policyLinks = [
    { label: "Privacy Policy (DPDPA 2023)", to: "/privacy-policy" },
    { label: "Terms & Conditions", to: "/terms-conditions" },
    { label: "Returns, Exchanges & Cancellations", to: "/returns-exchanges" },
    { label: "Delivery & Shipping Policy", to: "/delivery-information" },
    { label: "Cookie Policy", to: "/cookie-policy" },
    { label: "Grievance Redressal", to: "/grievance-redressal" },
    { label: "My Data Rights (Export / Deletion)", to: "/my-profile" },
  ];

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="Indian E-Commerce Disclosures"
        title="Legal & Security Compliance"
        subtitle="Published seller disclosures, security controls, and regulatory policies for shopping safely with Revakalp."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <section className="rk-surface-card p-6 sm:p-10 space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
            Business &amp; Seller Information
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
                Legal / Trade Name
              </dt>
              <dd className="mt-1 font-medium text-[#38131E]">{legalName}</dd>
            </div>
            <div className="p-4 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
                Business Model
              </dt>
              <dd className="mt-1 font-medium text-[#1A1718]">
                Single-Seller Curated Retail Store (Not a Third-Party Marketplace)
              </dd>
            </div>
            <div className="sm:col-span-2 p-4 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
                Principal Place of Business
              </dt>
              <dd className="mt-1 font-medium text-[#1A1718]">{address}</dd>
            </div>
            <div className="p-4 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
                Customer Support
              </dt>
              <dd className="mt-1 font-medium text-[#1A1718]">
                {supportEmail} · {phone}
              </dd>
            </div>
            <div className="p-4 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
                Grievance Officer
              </dt>
              <dd className="mt-1 font-medium text-[#1A1718]">
                {officerName} ({officerEmail})
              </dd>
            </div>
            <div className="p-4 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
                Tax / GST Information
              </dt>
              <dd className="mt-1 font-medium text-[#1A1718]">
                {gstin ? `GSTIN: ${gstin}` : "Available on tax invoices and upon request"}
              </dd>
            </div>
            <div className="p-4 rounded-[2px] bg-[#F7F1E5] border border-[#38131E]/12">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
                Default Country of Origin
              </dt>
              <dd className="mt-1 font-medium text-[#1A1718]">
                {originCountry} (shown individually per product page)
              </dd>
            </div>
          </dl>
        </section>

        <section className="rk-surface-card p-6 sm:p-10 space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
            Security &amp; Payment Protection
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[#1A1718]/80 leading-relaxed">
            <li>All traffic runs over HTTPS/TLS with strict transport and framing protections.</li>
            <li>Card, netbanking, and UPI payments execute through PCI-DSS compliant Razorpay checkout with constant-time HMAC signature and webhook verification; card numbers are never stored by Revakalp.</li>
            <li>Passwords are hashed with bcrypt, refresh tokens rotate in httpOnly cookies, and authentication/checkout endpoints enforce rate limits.</li>
            <li>
              To report a security vulnerability responsibly, email{" "}
              <a href={`mailto:${supportEmail}`} className="text-[#38131E] font-semibold underline">
                {supportEmail}
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="rk-surface-card p-6 sm:p-10 space-y-4">
          <h2 className="font-serif text-2xl text-[#38131E]">
            Compliance &amp; Policy Directory
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {policyLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-3 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/15 hover:border-[#D4AF63] text-sm font-medium text-[#38131E] transition-colors"
              >
                {item.label} →
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LegalDisclosures;
