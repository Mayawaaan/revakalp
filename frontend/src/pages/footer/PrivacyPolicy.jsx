import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" }
  }
};

const PrivacyPolicy = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute -top-40 left-32 w-[480px] h-[480px] bg-pink-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-40 right-32 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30" />

      <motion.div
        className="relative max-w-5xl mx-auto px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          variants={fadeUp}
        >
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
        </motion.div>

        {/* Content Card */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-10 text-pink-800"
          variants={fadeUp}
        >
          {[
            {
              title: "Information We Collect",
              body: (
                <>
                  <p className="leading-relaxed text-sm">
                    When you browse our website or place an order, we may collect
                    certain information including:
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
                    <li>Name, email address, phone number, and delivery address</li>
                    <li>Order and transaction details</li>
                    <li>Basic device and browser information</li>
                  </ul>
                </>
              )
            },
            {
              title: "How We Use Your Information",
              body: (
                <>
                  <p className="leading-relaxed text-sm">
                    Your information is used strictly to:
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
                    <li>Process and fulfill orders</li>
                    <li>Communicate order updates and customer support</li>
                    <li>Improve our website experience and services</li>
                    <li>Comply with legal and regulatory requirements</li>
                  </ul>
                </>
              )
            },
            {
              title: "Data Protection & Security",
              body: (
                <p className="leading-relaxed text-sm">
                  We take reasonable security measures to protect your personal
                  data against unauthorized access, misuse, or disclosure.
                  Payment details are processed through secure payment gateways
                  and are never stored on our servers.
                </p>
              )
            },
            {
              title: "Sharing of Information",
              body: (
                <p className="leading-relaxed text-sm">
                  We do not sell, rent, or trade your personal information. Data
                  is shared only with trusted partners such as delivery services
                  or payment processors, solely for order fulfillment.
                </p>
              )
            },
            {
              title: "Cookies",
              body: (
                <p className="leading-relaxed text-sm">
                  Our website may use cookies to enhance your browsing
                  experience, analyze site traffic, and understand user
                  preferences. You may disable cookies via your browser
                  settings.
                </p>
              )
            },
            {
              title: "Your Rights",
              body: (
                <p className="leading-relaxed text-sm">
                  You have the right to access, update, or request deletion of
                  your personal information by contacting us.
                </p>
              )
            },
            {
              title: "Updates to This Policy",
              body: (
                <p className="leading-relaxed text-sm">
                  This Privacy Policy may be updated periodically to reflect
                  changes in practices or legal requirements. Continued use of
                  our website implies acceptance of the updated policy.
                </p>
              )
            }
          ].map((section, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
            >
              <h3 className="font-serif text-2xl text-pink-900 mb-4">
                {section.title}
              </h3>
              {section.body}
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div
            className="pt-8 border-t border-pink-200"
            variants={fadeUp}
          >
            <p className="text-sm text-center text-pink-700">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at{" "}
              <strong>contact@revakalp.com</strong>.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PrivacyPolicy;
