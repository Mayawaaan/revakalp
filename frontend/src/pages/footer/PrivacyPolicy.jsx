import React from "react";
import PageHero from "../../components/globalComponents/PageHero";

const PolicySection = ({ number, title, children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-[44px_1fr] gap-4 sm:gap-6 pb-8 mb-8 border-b border-[#38131E]/10 last:border-0 last:pb-0 last:mb-0">
    <div className="w-10 h-10 rounded-full bg-[#38131E] text-[#F1D889] flex items-center justify-center text-xs font-bold shrink-0">
      {number}
    </div>
    <div>
      <h2 className="font-serif text-2xl text-[#38131E] mb-3">{title}</h2>
      {children}
    </div>
  </div>
);

const PrivacyPolicy = () => (
  <div className="bg-[#F7F1E5] text-[#1A1718]">
    <PageHero
      label="Your Privacy"
      title="Privacy Policy"
      subtitle="This policy explains how Revakalp collects, uses, and safeguards your personal information."
    />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="inline-flex items-center gap-2 bg-white border border-[#38131E]/15 rounded-full px-4 py-1.5 mb-8 text-xs text-[#38131E]">
        <span className="w-2 h-2 rounded-full bg-[#38131E]" />
        <span>Last updated: June 2025</span>
      </div>

      <div className="rk-surface-card p-6 sm:p-10 md:p-12">
        <PolicySection number="01" title="Information We Collect">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed mb-2">
            When you browse our website or place an order, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1A1718]/80">
            <li>Name, email address, phone number, and delivery address</li>
            <li>Order and transaction details</li>
            <li>Basic device and browser information</li>
          </ul>
        </PolicySection>

        <PolicySection number="02" title="How We Use Your Information">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed mb-2">
            Your information is used strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#1A1718]/80">
            <li>Process and fulfill orders</li>
            <li>Communicate order updates and provide customer support</li>
            <li>Improve our website experience and services</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </PolicySection>

        <PolicySection number="03" title="Data Protection & Security">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            We take reasonable security measures to protect your personal data against
            unauthorized access, misuse, or disclosure. Payment details are processed
            through secure payment gateways and are never stored on our servers.
          </p>
        </PolicySection>

        <PolicySection number="04" title="Sharing of Information">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            We do not sell, rent, or trade your personal information. Data is shared only
            with trusted partners such as delivery services or payment processors, solely
            for order fulfillment.
          </p>
        </PolicySection>

        <PolicySection number="05" title="Cookies">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            Our website uses essential cookies for session security and may use analytics
            to understand storefront performance. You may manage cookies via your browser settings.
          </p>
        </PolicySection>

        <PolicySection number="06" title="Your Rights">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            You have the right to access, update, or request deletion of your personal
            information at any time. Please contact us and we will respond within 48 hours.
          </p>
        </PolicySection>

        <PolicySection number="07" title="Updates to This Policy">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            This Privacy Policy may be updated periodically to reflect changes in our
            practices or legal requirements.
          </p>
        </PolicySection>

        <div className="mt-8 p-6 rounded-2xl bg-[#F7F1E5] border border-[#38131E]/10 text-center text-sm">
          Questions about this policy? Write to us at{" "}
          <a href="mailto:contact@revakalp.com" className="text-[#38131E] font-semibold underline">
            contact@revakalp.com
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
