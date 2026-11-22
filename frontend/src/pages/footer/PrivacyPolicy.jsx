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

const PrivacyPolicy = () => {
  const settings = useStore((s) => s.settings);
  const legalName = settings?.legalEntityName?.trim() || "Revakalp";
  const address =
    settings?.address?.trim() ||
    "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012";
  const supportEmail = settings?.supportEmail?.trim() || "contact@revakalp.com";
  const officerName = settings?.grievanceOfficerName?.trim() || "Anjali Katare";
  const officerRole =
    settings?.grievanceOfficerDesignation?.trim() ||
    "Founder & Grievance Redressal Officer";
  const officerEmail =
    settings?.grievanceOfficerEmail?.trim() || supportEmail;
  const officerPhone =
    settings?.grievanceOfficerPhone?.trim() ||
    settings?.phone?.trim() ||
    "+91 91096-76562";

  useSeoMeta({
    title: "Privacy Policy",
    description:
      "How Revakalp handles and protects personal data under India's Digital Personal Data Protection Act, 2023 (DPDPA) and IT Act rules.",
    canonicalPath: "/privacy-policy",
  });

  const openCookiePreferences = () => {
    window.dispatchEvent(new Event("rk-open-cookie-settings"));
  };

  return (
    <div className="bg-[#F7F1E5] text-[#1A1718]">
      <PageHero
        label="DPDPA 2023 & IT Act Notice"
        title="Privacy Policy"
        subtitle="How Revakalp collects, uses, and protects personal data shared on our website."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="inline-block bg-[#FBF7EE] border border-[#38131E]/15 rounded-[2px] px-4 py-1.5 mb-8 text-xs text-[#38131E]">
          Last updated: November 2026
        </div>

        <div className="rk-surface-card p-6 sm:p-10 md:p-12">
          <PolicySection title="Data Fiduciary Identity">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              This platform is operated by <strong className="text-[#38131E]">{legalName}</strong>,
              located at {address}. Under India&apos;s Digital Personal Data Protection Act, 2023
              (DPDPA) and the Information Technology (Reasonable Security Practices and Procedures
              and Sensitive Personal Data or Information) Rules, 2011, {legalName} acts as the
              Data Fiduciary for personal data collected through this storefront.
            </p>
          </PolicySection>

          <PolicySection title="What We Collect & Why">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed mb-3">
              We collect only the personal data strictly necessary for specified, lawful
              purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1A1718]/80">
              <li>Account details (full name, email address, and encrypted password) to manage logins and order history.</li>
              <li>Delivery details (recipient address, city, state, PIN code, and phone number) to pack, ship, and update orders.</li>
              <li>Order, return, and grievance records (including payment status references and continuous unboxing videos when submitted for returns).</li>
              <li>Essential session tokens and opt-in storefront analytics preferences stored locally.</li>
            </ul>
          </PolicySection>

          <PolicySection title="Consent & Withdrawal">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              Personal data is processed with your clear affirmative consent at account
              registration or checkout, or where needed to fulfill an order and meet Indian
              tax and accounting obligations. Optional analytics are disabled by default until
              you explicitly opt in. You may withdraw consent for optional cookies anytime via{" "}
              <button
                type="button"
                onClick={openCookiePreferences}
                className="text-[#38131E] font-semibold underline cursor-pointer"
              >
                Cookie Preferences
              </button>{" "}
              or by reading our{" "}
              <Link to="/cookie-policy" className="text-[#38131E] font-semibold underline">
                Cookie Policy
              </Link>
              .
            </p>
          </PolicySection>

          <PolicySection title="Your Rights as a Data Principal (DPDPA 2023)">
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#1A1718]/80">
              <li>
                <strong className="text-[#38131E]">Right to Access:</strong> Download a summary
                of your profile, orders, wishlist, bag, and reviews anytime in{" "}
                <Link to="/my-profile" className="text-[#38131E] font-semibold underline">
                  My Profile
                </Link>
                .
              </li>
              <li>
                <strong className="text-[#38131E]">Right to Correction &amp; Updating:</strong>{" "}
                Update your account details inside My Profile or write to us for corrections.
              </li>
              <li>
                <strong className="text-[#38131E]">Right to Erasure:</strong> Permanently delete
                your account and personal profile in My Profile (tax-invoice totals are kept in
                redacted form where required by Indian GST law).
              </li>
              <li>
                <strong className="text-[#38131E]">Right of Grievance Redressal &amp; Nomination:</strong>{" "}
                Raise complaints or nominate an authorized representative via our{" "}
                <Link to="/grievance-redressal" className="text-[#38131E] font-semibold underline">
                  Grievance Redressal
                </Link>{" "}
                page.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Third-Party Processors & Payment Security">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              We never sell, rent, or trade your personal data. Information is shared strictly
              with service partners necessary to complete your purchase — including Razorpay
              (PCI-DSS compliant payment processing; we never store card numbers, CVVs, or
              UPI PINs on our servers), delivery couriers, and cloud media/email infrastructure.
            </p>
          </PolicySection>

          <PolicySection title="Security Safeguards & Retention">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              We protect data using HTTPS/TLS encryption in transit, bcrypt password hashing,
              httpOnly refresh cookies with rotation, server-side input sanitization, and rate
              limiting. Account data is kept while your account remains active; transaction and
              invoice records are retained for statutory periods required under applicable Indian
              GST and commercial laws.
            </p>
          </PolicySection>

          <PolicySection title="Children&apos;s Privacy">
            <p className="text-sm text-[#1A1718]/80 leading-relaxed">
              Our online storefront is intended for adults aged 18 years and above who are
              competent to contract under the Indian Contract Act, 1872. We do not knowingly
              collect personal data of children without verifiable parental consent.
            </p>
          </PolicySection>

          <PolicySection title="Grievance & Data Protection Contact">
            <div className="text-sm text-[#1A1718]/80 space-y-1.5 leading-relaxed">
              <p>
                <strong className="text-[#38131E]">{officerName}</strong> ({officerRole})
              </p>
              <p>{address}</p>
              <p>
                Email:{" "}
                <a href={`mailto:${officerEmail}`} className="text-[#38131E] font-semibold underline">
                  {officerEmail}
                </a>{" "}
                · Phone / WhatsApp: <strong className="text-[#38131E]">{officerPhone}</strong>
              </p>
              <p className="pt-1">
                Submit a formal privacy or order ticket via{" "}
                <Link to="/grievance-redressal" className="text-[#38131E] font-semibold underline">
                  Grievance Redressal
                </Link>
                .
              </p>
            </div>
          </PolicySection>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
