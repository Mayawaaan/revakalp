import React, { useState } from "react";
import PageHero from "../../components/globalComponents/PageHero";
import { Link } from "react-router-dom";

const FAQ = () => {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "Are all Revakalp sarees authentic?",
      a: "Yes. Every saree at Revakalp is carefully curated from trusted weavers, cooperatives, and manufacturers across India. Each piece is quality-checked for fabric, weave, and craftsmanship before being listed.",
    },
    {
      q: "Do you sell handloom sarees?",
      a: "Yes. We offer a wide selection of handloom sarees including Chanderi, Maheshwari, and Banarasi weaves. Product descriptions clearly mention fabric, weave, and sourcing details.",
    },
    {
      q: "How long does delivery take?",
      a: "Orders are usually dispatched within 3–5 business days. Delivery timelines vary based on your location and will be shared via email once your order is shipped.",
    },
    {
      q: "Can I return or exchange a saree?",
      a: "Yes. We accept return or exchange requests within 7 days of delivery, provided the product is unused, unwashed, and has original tags intact.",
    },
    {
      q: "Do the saree colors match the images?",
      a: "We make every effort to display accurate colors. However, slight variations may occur due to screen settings or the handcrafted nature of textiles.",
    },
    {
      q: "Is Cash on Delivery available?",
      a: "Yes, Cash on Delivery is available for most locations across India.",
    },
    {
      q: "How do I know my size?",
      a: "Sarees are free-size. For stitched garments and lehengas, size charts and measurements are provided on each product page.",
    },
    {
      q: "How can I contact customer support?",
      a: "You can reach us at contact@revakalp.com or call/WhatsApp us at +91 91096-76562. Our team typically responds within 24 hours.",
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff9fb" }}>

      <PageHero
        label="Support"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about shopping with Revakalp — thoughtfully answered for your peace of mind."
      />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px 100px" }}>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 18,
                border: open === i ? "1.5px solid #c9487c" : "1.5px solid #fce7f3",
                boxShadow: open === i
                  ? "0 8px 32px rgba(201,72,124,0.12)"
                  : "0 2px 12px rgba(201,72,124,0.05)",
                overflow: "hidden",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", textAlign: "left",
                  padding: "22px 28px",
                  background: "none", border: "none",
                  cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  gap: 16,
                }}
              >
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.05rem", color: "#831843", fontWeight: 600,
                  lineHeight: 1.4,
                }}>{item.q}</span>
                <span style={{
                  flexShrink: 0,
                  width: 28, height: 28, borderRadius: "50%",
                  background: open === i
                    ? "linear-gradient(135deg, #c9487c, #7a1045)"
                    : "#fce7f3",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", color: open === i ? "#fff" : "#c9487c",
                  transition: "all 0.25s",
                  transform: open === i ? "rotate(45deg)" : "rotate(0)",
                }}>+</span>
              </button>

              {open === i && (
                <div style={{
                  padding: "0 28px 24px",
                  borderTop: "1px solid #fce7f3",
                }}>
                  <p style={{
                    color: "#9d174d", fontSize: "0.92rem",
                    lineHeight: 1.85, paddingTop: 16,
                  }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 64, textAlign: "center",
          background: "linear-gradient(135deg, #1a0010, #3d0030)",
          borderRadius: 28, padding: "48px 40px",
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.4rem", color: "#fff", marginBottom: 12,
          }}>Still have a question?</p>
          <p style={{ color: "#fce7f3", fontSize: "0.9rem", marginBottom: 28, opacity: 0.85 }}>
            Write to us at <strong>contact@revakalp.com</strong> — we're always happy to help.
          </p>
          <Link to="/contact" style={{
            background: "linear-gradient(135deg, #c9487c, #7a1045)",
            color: "#fff", padding: "13px 36px", borderRadius: 50,
            textDecoration: "none", fontWeight: 600, fontSize: "0.9rem",
            boxShadow: "0 6px 24px rgba(201,72,124,0.4)",
            display: "inline-block",
          }}>
            Contact Us
          </Link>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
    </div>
  );
};

export default FAQ;
