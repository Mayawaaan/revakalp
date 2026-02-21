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

const FAQ = () => {
  const faqs = [
    {
      q: "Are all Revakalp sarees authentic?",
      a: "Yes. Every saree at Revakalp is carefully curated from trusted weavers, cooperatives, and manufacturers across India. Each piece is quality-checked for fabric, weave, and craftsmanship before being listed."
    },
    {
      q: "Do you sell handloom sarees?",
      a: "Yes. We offer a wide selection of handloom sarees. Product descriptions clearly mention fabric, weave, and sourcing details to help you make an informed choice."
    },
    {
      q: "How long does delivery take?",
      a: "Orders are usually dispatched within 2–4 business days. Delivery timelines vary based on location and will be shared once your order is shipped."
    },
    {
      q: "Can I return or exchange a saree?",
      a: "Yes. We accept return or exchange requests within 7 days of delivery, provided the product is unused, unwashed, and has original tags intact."
    },
    {
      q: "Do the saree colors match the images?",
      a: "We make every effort to display accurate colors. However, slight variations may occur due to screen settings or the handcrafted nature of textiles."
    },
    {
      q: "Is Cash on Delivery available?",
      a: "Yes, Cash on Delivery is available for most locations in India."
    },
    {
      q: "How do I know my size?",
      a: "Sarees are free-size. For stitched garments, size details are provided on each product page."
    },
    {
      q: "How can I contact customer support?",
      a: "You can reach us at contact@revakalp.com. Our team typically responds within 24–48 hours."
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Background glow (kept static for elegance) */}
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
            Support
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-pink-700 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about shopping with Revakalp —
            thoughtfully answered for your peace of mind.
          </p>
        </motion.div>

        {/* FAQ Card */}
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-10 space-y-8"
          variants={fadeUp}
        >
          {faqs.map((item, index) => (
            <motion.div
              key={index}
              className="border-b border-pink-200 pb-6"
              variants={fadeUp}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-serif text-xl text-pink-900 mb-3">
                {item.q}
              </h3>
              <p className="text-pink-700 text-sm leading-relaxed">
                {item.a}
              </p>
            </motion.div>
          ))}

          {/* Footer Note */}
          <motion.div
            className="pt-8 text-center"
            variants={fadeUp}
          >
            <p className="text-sm text-pink-700">
              Still have questions? Write to us at{" "}
              <strong>contact@revakalp.com</strong> — we’re always happy to help.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FAQ;
