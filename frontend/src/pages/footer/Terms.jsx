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

const Terms = () => (
  <div className="bg-[#F7F1E5] text-[#1A1718]">
    <PageHero
      label="Legal"
      title="Terms & Conditions"
      subtitle="By accessing our website or placing an order, you agree to the terms outlined below."
    />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="inline-flex items-center gap-2 bg-white border border-[#38131E]/15 rounded-full px-4 py-1.5 mb-8 text-xs text-[#38131E]">
        <span className="w-2 h-2 rounded-full bg-[#38131E]" />
        <span>Last updated: June 2025</span>
      </div>

      <div className="rk-surface-card p-6 sm:p-10 md:p-12">
        <PolicySection number="01" title="General Information">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            Revakalp is an online retail platform offering curated Indian apparel and
            contemporary clothing. All content, products, and services on this website are
            subject to these terms.
          </p>
        </PolicySection>

        <PolicySection number="02" title="Products & Descriptions">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            We strive to display product details, colors, and descriptions as accurately as
            possible. Minor variations may occur due to lighting, screen settings, or textile
            characteristics.
          </p>
        </PolicySection>

        <PolicySection number="03" title="Pricing & Availability">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            Prices are subject to change without prior notice. All orders are subject to
            availability and confirmation. In rare cases, we may cancel or limit quantities.
          </p>
        </PolicySection>

        <PolicySection number="04" title="Orders & Payments">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            By placing an order, you confirm that the information provided is accurate and
            complete. Payments must be made through our approved payment methods.
          </p>
        </PolicySection>

        <PolicySection number="05" title="Returns & Refunds">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            Our return and exchange policies are outlined on the Returns &amp; Exchanges page.
          </p>
        </PolicySection>

        <PolicySection number="06" title="Intellectual Property">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            All content on this website — including text, logos, and brand assets — is
            the property of Revakalp or its licensors and may not be reproduced without
            prior written permission.
          </p>
        </PolicySection>

        <PolicySection number="07" title="Limitation of Liability">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            Revakalp shall not be liable for any indirect, incidental, or consequential damages
            arising from the use of our website or products, to the extent permitted by law.
          </p>
        </PolicySection>

        <PolicySection number="08" title="Changes to Terms">
          <p className="text-sm text-[#1A1718]/80 leading-relaxed">
            We reserve the right to update or modify these terms at any time. Continued use
            indicates acceptance of the updated terms.
          </p>
        </PolicySection>

        <div className="mt-8 p-6 rounded-2xl bg-[#F7F1E5] border border-[#38131E]/10 text-center text-sm">
          For questions regarding these terms, contact{" "}
          <a href="mailto:contact@revakalp.com" className="text-[#38131E] font-semibold underline">
            contact@revakalp.com
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Terms;
