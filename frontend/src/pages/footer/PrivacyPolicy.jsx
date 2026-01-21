import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute -top-40 left-32 w-[480px] h-[480px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-32 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-5xl mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Your Privacy
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            Privacy Policy
          </h1>
          <p className="mt-6 text-pink-700 max-w-2xl mx-auto leading-relaxed">
            At Revakalp, your privacy is deeply respected. This policy explains
            how we collect, use, and safeguard your personal information when
            you interact with our website or make a purchase.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-10 text-pink-800">

          {/* Information We Collect */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Information We Collect
            </h3>
            <p className="leading-relaxed text-sm">
              When you browse our website or place an order, we may collect
              certain information including:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
              <li>Name, email address, phone number, and delivery address</li>
              <li>Order and transaction details</li>
              <li>Basic device and browser information</li>
            </ul>
          </div>

          {/* How We Use Information */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              How We Use Your Information
            </h3>
            <p className="leading-relaxed text-sm">
              Your information is used strictly to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
              <li>Process and fulfill orders</li>
              <li>Communicate order updates and customer support</li>
              <li>Improve our website experience and services</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </div>

          {/* Data Protection */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Data Protection & Security
            </h3>
            <p className="leading-relaxed text-sm">
              We take reasonable security measures to protect your personal
              data against unauthorized access, misuse, or disclosure.
              Payment details are processed through secure, trusted payment
              gateways and are never stored on our servers.
            </p>
          </div>

          {/* Sharing Information */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Sharing of Information
            </h3>
            <p className="leading-relaxed text-sm">
              We do not sell, rent, or trade your personal information. Your
              data may only be shared with trusted partners such as delivery
              providers or payment processors, solely for order fulfillment
              purposes.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Cookies
            </h3>
            <p className="leading-relaxed text-sm">
              Our website may use cookies to enhance your browsing experience,
              analyze site traffic, and understand user preferences. You may
              choose to disable cookies through your browser settings.
            </p>
          </div>

          {/* User Rights */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Your Rights
            </h3>
            <p className="leading-relaxed text-sm">
              You have the right to access, update, or request deletion of
              your personal information. For any such requests, please contact
              us using the details below.
            </p>
          </div>

          {/* Policy Updates */}
          <div>
            <h3 className="font-serif text-2xl text-pink-900 mb-4">
              Updates to This Policy
            </h3>
            <p className="leading-relaxed text-sm">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. Continued use of
              our website implies acceptance of the updated policy.
            </p>
          </div>

          {/* Contact */}
          <div className="pt-8 border-t border-pink-200">
            <p className="text-sm text-center text-pink-700">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at{" "}
              <strong>contact@revakalp.com</strong>.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
