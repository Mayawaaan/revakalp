import React, { useState } from "react";
import PageHero from "../../components/globalComponents/PageHero";
import NewsletterBox from "../../components/homepage/NewsletterBox";

/* ── Shared card styles ── */
const CARD_STYLE = {
  background: "#fff",
  borderRadius: 28,
  border: "1px solid #fce7f3",
  boxShadow: "0 4px 24px rgba(201,72,124,0.08)",
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({ name: "", email: "", message: "" });
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff9fb" }}>

      {/* ── HERO ── */}
      <PageHero
        label="Get in Touch"
        title="We'd Love to Hear From You"
        subtitle="Whether you need styling advice, order help, or just want to say hello — our team is always a message away."
      />

      {/* ── INFO CARDS ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28,
          marginTop: -48, position: "relative", zIndex: 10, marginBottom: 80,
        }}>
          {[
            {
              icon: "📍",
              title: "Visit Our Boutique",
              lines: [
                "231-231, Shop No. 2",
                "Dhanwantri Nagar, Rajendra Nagar",
                "Indore, Madhya Pradesh – 452012",
                "",
                "Mon – Sat  |  10:30 AM – 8:30 PM",
              ],
              accent: "#c9487c",
            },
            {
              icon: "📞",
              title: "Talk to Us",
              lines: [
                "Phone: +91 91096-76562",
                "Email: contact@revakalp.com",
                "",
                "Our stylists reply within 24 hours.",
              ],
              accent: "#be185d",
            },
            {
              icon: "💼",
              title: "Join Revakalp",
              lines: [
                "Help us preserve India's textile",
                "legacy while shaping a modern",
                "fashion brand.",
                "",
                "Exciting opportunities await.",
              ],
              accent: "#831843",
              dark: true,
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                ...CARD_STYLE,
                background: card.dark
                  ? "linear-gradient(135deg, #831843, #c9487c)"
                  : "#fff",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(201,72,124,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,72,124,0.08)";
              }}
            >
              {/* Card accent bar */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${card.accent}, transparent)` }} />
              <div style={{ padding: "32px 28px" }}>
                <div style={{ fontSize: "2rem", marginBottom: 14 }}>{card.icon}</div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.25rem",
                  color: card.dark ? "#fff" : "#831843",
                  marginBottom: 14,
                }}>{card.title}</h3>
                {card.lines.map((l, j) => (
                  <p key={j} style={{
                    color: card.dark ? "rgba(255,255,255,0.85)" : "#9d174d",
                    fontSize: "0.88rem", lineHeight: 1.7,
                    marginBottom: l === "" ? 8 : 0,
                  }}>{l || "\u00a0"}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTACT FORM ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left copy */}
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: "0.35em", fontSize: 11, color: "#c9487c", marginBottom: 16 }}>
              Personal Concierge
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "#831843",
              lineHeight: 1.2, marginBottom: 24,
            }}>
              Speak With Our Styling Team
            </h2>
            <p style={{ color: "#9d174d", lineHeight: 1.9, marginBottom: 32, fontSize: "0.98rem" }}>
              From bridal consultations to fabric questions — our experts are
              here to guide you personally, one drape at a time.
            </p>
            {[
              { icon: "✦", text: "Personal styling & bridal guidance" },
              { icon: "✦", text: "Order tracking & delivery support" },
              { icon: "✦", text: "Wedding & festive consultations" },
              { icon: "✦", text: "Bulk & gifting enquiries" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <span style={{ color: "#c9487c", fontSize: "0.75rem", fontWeight: 700 }}>{item.icon}</span>
                <p style={{ color: "#9d174d", fontSize: "0.9rem" }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Right form */}
          <form onSubmit={handleSubmit} style={{
            background: "#fff", borderRadius: 28,
            padding: "48px 40px",
            boxShadow: "0 12px 48px rgba(201,72,124,0.12)",
            border: "1px solid #fce7f3",
          }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem", color: "#831843", marginBottom: 28,
            }}>Send a Message</h3>

            {[
              { name: "name", placeholder: "Your Name", type: "text" },
              { name: "email", placeholder: "Email Address", type: "email" },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: 18 }}>
                <input
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  style={{
                    width: "100%", padding: "14px 20px",
                    borderRadius: 12, border: "1.5px solid #fce7f3",
                    fontSize: "0.92rem", color: "#831843",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={e => e.target.style.borderColor = "#c9487c"}
                  onBlur={e => e.target.style.borderColor = "#fce7f3"}
                />
              </div>
            ))}

            <div style={{ marginBottom: 24 }}>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                style={{
                  width: "100%", padding: "14px 20px",
                  borderRadius: 12, border: "1.5px solid #fce7f3",
                  fontSize: "0.92rem", color: "#831843",
                  outline: "none", resize: "none", boxSizing: "border-box",
                  fontFamily: "'Inter', sans-serif",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#c9487c"}
                onBlur={e => e.target.style.borderColor = "#fce7f3"}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                background: sent
                  ? "linear-gradient(135deg, #16a34a, #15803d)"
                  : "linear-gradient(135deg, #c9487c, #7a1045)",
                color: "#fff", padding: "15px",
                borderRadius: 12, border: "none",
                fontSize: "0.95rem", fontWeight: 600,
                cursor: "pointer", letterSpacing: "0.04em",
                boxShadow: "0 6px 24px rgba(201,72,124,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s, background 0.3s",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
            >
              {sent ? "✓ Message Sent!" : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* ── CLOSING ── */}
      <div style={{
        background: "linear-gradient(135deg, #fff1f4, #fce7f3)",
        padding: "80px 32px", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#831843",
          maxWidth: 600, margin: "0 auto", lineHeight: 1.5,
        }}>
          At Revakalp, we treat every interaction<br />
          with the same care as the craft itself.
        </p>
      </div>

      <NewsletterBox />

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
    </div>
  );
}
