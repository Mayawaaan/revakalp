import React from "react";

const Terms = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-40 left-32 w-[480px] h-[480px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-32 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-5xl mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Legal
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            Terms & Conditions
          </h1>
          <p className="mt-6 text-pink-700 max-w-2xl mx-auto leading-relaxed">
            These terms outline the rules and guidelines for using Revakalp.
            By accessing our website or making a purchase, you agree to the
            conditions described below.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-10 text-pink-800">

          {/* General */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              General Information
            </h3>
            <p className="leading-relaxed text-sm">
              Revakalp is an online platform offering curated Indian apparel
              and textiles. All content, products, and services provided on
              this website are subject to these terms.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Products & Descriptions
            </h3>
            <p className="leading-relaxed text-sm">
              We strive to display product details, colors, and descriptions
              as accurately as possible. However, minor variations may occur
              due to lighting, screen settings, or the handcrafted nature of
              our products.
            </p>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Pricing & Availability
            </h3>
            <p className="leading-relaxed text-sm">
              Prices are subject to change without prior notice. All orders
              are subject to availability and confirmation. In rare cases,
              we may cancel or limit quantities at our discretion.
            </p>
          </div>

          {/* Orders */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Orders & Payments
            </h3>
            <p className="leading-relaxed text-sm">
              By placing an order, you confirm that the information provided
              is accurate and complete. Payments must be made through our
              approved payment methods. Revakalp reserves the right to refuse
              or cancel any order if fraud or misuse is suspected.
            </p>
          </div>

          {/* Returns */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Returns & Refunds
            </h3>
            <p className="leading-relaxed text-sm">
              Our return and exchange policies are outlined on the Returns &
              Exchanges page. By placing an order, you acknowledge and agree
              to those policies.
            </p>
          </div>

          {/* Intellectual Property */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Intellectual Property
            </h3>
            <p className="leading-relaxed text-sm">
              All content on this website, including images, text, logos, and
              designs, is the property of Revakalp and may not be used,
              reproduced, or distributed without prior written permission.
            </p>
          </div>

          {/* Liability */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Limitation of Liability
            </h3>
            <p className="leading-relaxed text-sm">
              Revakalp shall not be liable for any indirect, incidental, or
              consequential damages arising from the use of our website or
              products, to the extent permitted by law.
            </p>
          </div>

          {/* Changes */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Changes to Terms
            </h3>
            <p className="leading-relaxed text-sm">
              We reserve the right to update or modify these terms at any
              time. Continued use of the website after changes indicates
              acceptance of the updated terms.
            </p>
          </div>

          {/* Contact */}
          <div className="pt-8 border-t border-pink-200">
            <p className="text-sm text-center text-pink-700">
              For any questions regarding these terms, please contact us at{" "}
              <strong>contact@revakalp.com</strong>.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Terms;
