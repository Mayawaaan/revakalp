import React from "react";
import PageHero from "../../components/globalComponents/PageHero";
import { Link } from "react-router-dom";

const bodyText = { color: "#9d174d", fontSize: "0.92rem", lineHeight: 1.85 };
const listStyle = { color: "#9d174d", fontSize: "0.88rem", lineHeight: 1.85, paddingLeft: 20, marginTop: 10 };

const Returns = () => (
  <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff9fb" }}>

    <PageHero
      label="Customer Care"
      title="Returns & Exchanges"
      subtitle="We want you to love every Revakalp purchase. If something isn't quite right, we're here to help — simply, fairly, and transparently."
    />

    <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px 100px" }}>

      {/* Quick eligibility banner */}
      <div style={{
        background: "linear-gradient(135deg, #fce7f3, #fff1f4)",
        borderRadius: 20, padding: "24px 32px",
        border: "1.5px solid #fbbf2440",
        display: "flex", alignItems: "center", gap: 20, marginBottom: 48,
      }}>
        <span style={{ fontSize: "2rem", flexShrink: 0 }}>⏱️</span>
        <div>
          <p style={{ color: "#831843", fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}>
            7-Day Return Window
          </p>
          <p style={{ color: "#9d174d", fontSize: "0.88rem" }}>
            Return or exchange requests must be raised within 7 days of delivery.
          </p>
        </div>
      </div>

      <div style={{
        background: "#fff", borderRadius: 28,
        border: "1px solid #fce7f3",
        boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
        padding: "52px 56px",
      }}>
        {[
          {
            title: "Return Eligibility",
            content: (
              <>
                <p style={bodyText}>You may request a return or exchange within <strong style={{ color: "#c9487c" }}>7 days</strong> of delivery, provided the product:</p>
                <ul style={listStyle}>
                  <li>Is unused, unwashed, and unaltered</li>
                  <li>Has original tags and packaging intact</li>
                  <li>Is free from damage, stains, or odors</li>
                </ul>
              </>
            ),
          },
          {
            title: "Non-Returnable Items",
            content: (
              <>
                <p style={bodyText}>Due to the nature of our products, the following are not eligible for return or exchange:</p>
                <ul style={listStyle}>
                  <li>Customized or stitched garments</li>
                  <li>Clearance or sale items</li>
                  <li>Products marked as "Final Sale"</li>
                </ul>
              </>
            ),
          },
          {
            title: "How to Initiate a Return",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
                {[
                  { step: "1", text: "Email us at contact@revakalp.com with your order ID and reason for return." },
                  { step: "2", text: "Our team will review your request within 24–48 hours and confirm eligibility." },
                  { step: "3", text: "Once approved, we'll guide you through the pickup or self-shipping process." },
                ].map((s) => (
                  <div key={s.step} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #c9487c, #7a1045)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "0.75rem", fontWeight: 700, marginTop: 2,
                    }}>{s.step}</div>
                    <p style={bodyText}>{s.text}</p>
                  </div>
                ))}
              </div>
            ),
          },
          {
            title: "Refunds",
            content: (
              <p style={bodyText}>
                After we receive and inspect the returned product, refunds (if applicable) will be
                processed within <strong style={{ color: "#c9487c" }}>7–10 business days</strong> to
                your original payment method.
              </p>
            ),
          },
          {
            title: "Exchanges",
            content: (
              <p style={bodyText}>
                Exchanges are subject to product availability. If the desired item is unavailable,
                you may opt for store credit or a full refund.
              </p>
            ),
          },
        ].map((item, i, arr) => (
          <div key={i} style={{
            paddingBottom: i < arr.length - 1 ? 36 : 0,
            marginBottom: i < arr.length - 1 ? 36 : 0,
            borderBottom: i < arr.length - 1 ? "1px solid #fce7f3" : "none",
          }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.15rem", color: "#831843", marginBottom: 14,
            }}>{item.title}</h3>
            {item.content}
          </div>
        ))}

        {/* Bottom contact */}
        <div style={{
          background: "linear-gradient(135deg, #fce7f3, #fff1f4)",
          borderRadius: 16, padding: "28px 32px", textAlign: "center", marginTop: 36,
        }}>
          <p style={{ color: "#9d174d", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 16 }}>
            Questions about a return? We're here to help.
          </p>
          <Link to="/contact" style={{
            background: "linear-gradient(135deg, #c9487c, #7a1045)",
            color: "#fff", padding: "11px 32px", borderRadius: 50,
            textDecoration: "none", fontSize: "0.88rem", fontWeight: 600,
            display: "inline-block",
            boxShadow: "0 4px 16px rgba(201,72,124,0.3)",
          }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>

    <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
  </div>
);

export default Returns;
