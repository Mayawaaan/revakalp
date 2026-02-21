import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
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

const Delivery = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Background glow */}
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
            Shipping
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            Delivery & Shipping
          </h1>
          <p className="mt-6 text-pink-700 max-w-2xl mx-auto leading-relaxed">
            Thoughtfully packed. Carefully delivered. Every Revakalp saree
            reaches you with the respect it deserves.
          </p>
        </motion.div>

        {/* Content Card */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-10"
          variants={fadeUp}
        >
          {[
            {
              title: "Our Delivery Promise",
              content: (
                <ul className="list-disc pl-5 space-y-2 text-pink-700">
                  <li>Secure packaging for delicate handwoven textiles</li>
                  <li>Reliable Pan-India delivery partners</li>
                  <li>Order tracking shared after dispatch</li>
                  <li>Quality inspection before every shipment</li>
                </ul>
              )
            },
            {
              title: "Dispatch Timeline",
              content: (
                <p className="text-pink-700">
                  Orders are typically dispatched within{" "}
                  <strong>3–5 business days</strong>. As our sarees are
                  handcrafted, timelines may vary slightly based on availability
                  and destination.
                </p>
              )
            },
            {
              title: "Handloom & GI Assurance",
              content: (
                <p className="text-pink-700">
                  Revakalp specializes in authentic handloom and GI-tagged
                  sarees, sourced directly from artisan communities to preserve
                  India’s textile heritage.
                </p>
              )
            },
            {
              title: "Care During Transit",
              content: (
                <p className="text-pink-700">
                  Each saree is packed using breathable, fabric-safe materials
                  to protect it from moisture, dust, and transit stress.
                </p>
              )
            },
            {
              title: "Need Help?",
              content: (
                <p className="text-pink-700">
                  For delivery assistance, bulk retail orders, or tracking
                  queries, our support team is always happy to help.
                </p>
              )
            }
          ].map((section, index) => (
            <motion.div
              key={index}
              className="border-b border-pink-200 pb-6 last:border-none"
              variants={fadeUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="font-serif text-xl text-pink-900 mb-3">
                {section.title}
              </h2>
              {section.content}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Delivery;
