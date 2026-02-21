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

const Returns = () => {
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
            Customer Care
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            Returns & Exchanges
          </h1>
          <p className="mt-6 text-pink-700 max-w-2xl mx-auto leading-relaxed">
            We want you to love every Revakalp purchase. If something isn’t
            quite right, we’re here to help — simply, fairly, and transparently.
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-10 text-pink-800"
          variants={fadeUp}
        >
          {[
            {
              title: "Return Eligibility",
              body: (
                <>
                  <p className="leading-relaxed">
                    You may request a return or exchange within{" "}
                    <strong>7 days</strong> of delivery, provided the product:
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
                    <li>Is unused, unwashed, and unaltered</li>
                    <li>Has original tags and packaging intact</li>
                    <li>Is free from damage, stains, or odors</li>
                  </ul>
                </>
              )
            },
            {
              title: "Non-Returnable Items",
              body: (
                <>
                  <p className="leading-relaxed text-sm">
                    Due to the nature of our products, the following items are
                    not eligible for return or exchange:
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-sm">
                    <li>Customized or stitched garments</li>
                    <li>Clearance or sale items</li>
                    <li>Products marked as “Final Sale”</li>
                  </ul>
                </>
              )
            },
            {
              title: "How to Initiate a Return",
              body: (
                <ol className="list-decimal pl-6 space-y-3 text-sm leading-relaxed">
                  <li>
                    Email us at <strong>contact@revakalp.com</strong> with
                    your order ID and reason for return.
                  </li>
                  <li>
                    Our team will review your request within 24–48 hours.
                  </li>
                  <li>
                    Once approved, we’ll guide you through the pickup or
                    self-shipping process.
                  </li>
                </ol>
              )
            },
            {
              title: "Refunds",
              body: (
                <p className="leading-relaxed text-sm">
                  After we receive and inspect the returned product, refunds
                  (if applicable) will be processed within{" "}
                  <strong>7–10 business days</strong> to your original payment
                  method.
                </p>
              )
            },
            {
              title: "Exchanges",
              body: (
                <p className="leading-relaxed text-sm">
                  Exchanges are subject to product availability. If the desired
                  item is unavailable, you may opt for store credit or a refund.
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
              Still have questions? Write to us at{" "}
              <strong>contact@revakalp.com</strong> — we’re always happy to help.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Returns;
