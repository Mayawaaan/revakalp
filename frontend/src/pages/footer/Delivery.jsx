import React from "react";
import PageHero from "../../components/globalComponents/PageHero";

const bodyText = { color: "#9d174d", fontSize: "0.92rem", lineHeight: 1.85 };
const listStyle = { color: "#9d174d", fontSize: "0.88rem", lineHeight: 1.85, paddingLeft: 20, marginTop: 10 };

const Delivery = () => (
  <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff9fb" }}>

    <PageHero
      label="Shipping"
      title="Delivery & Shipping"
      subtitle="Thoughtfully packed. Carefully delivered. Every Revakalp saree reaches you with the respect it deserves."
    />

    {/* Stats row */}
    <div style={{ background: "linear-gradient(135deg, #1a0010, #3d0030)", padding: "48px 32px" }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
        textAlign: "center",
      }}>
        {[
          { value: "3–5", label: "Days Dispatch", icon: "📦" },
          { value: "Pan-India", label: "Delivery", icon: "🚚" },
          { value: "100%", label: "Secure Packaging", icon: "🔒" },
          { value: "24/7", label: "Order Tracking", icon: "📍" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.07)",
            borderRadius: 20, padding: "28px 16px",
            border: "1px solid rgba(249,168,212,0.15)",
          }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>{s.icon}</div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.4rem", fontWeight: 700, color: "#fbbf24", lineHeight: 1,
            }}>{s.value}</p>
            <p style={{ color: "#fce7f3", fontSize: "0.78rem", marginTop: 6, opacity: 0.8 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px 100px" }}>
      <div style={{
        background: "#fff", borderRadius: 28,
        border: "1px solid #fce7f3",
        boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
        padding: "52px 56px",
      }}>
        {[
          {
            icon: "✦",
            title: "Our Delivery Promise",
            content: (
              <ul style={listStyle}>
                <li>Secure packaging for delicate handwoven textiles</li>
                <li>Reliable Pan-India delivery partners</li>
                <li>Order tracking shared after dispatch</li>
                <li>Quality inspection before every shipment</li>
              </ul>
            ),
          },
          {
            icon: "✦",
            title: "Dispatch Timeline",
            content: (
              <p style={bodyText}>
                Orders are typically dispatched within <strong style={{ color: "#c9487c" }}>3–5 business days</strong>.
                As our sarees are handcrafted, timelines may vary slightly based on availability
                and destination. You will receive a tracking number by email once dispatched.
              </p>
            ),
          },
          {
            icon: "✦",
            title: "Handloom & Artisan Assurance",
            content: (
              <p style={bodyText}>
                Revakalp specializes in authentic handloom sarees sourced directly from artisan
                communities. We take extra care to ensure each piece is properly folded, wrapped
                in tissue, and boxed before shipping.
              </p>
            ),
          },
          {
            icon: "✦",
            title: "Care During Transit",
            content: (
              <p style={bodyText}>
                Each saree is packed using breathable, fabric-safe materials to protect it from
                moisture, dust, and transit stress. Lehengas are individually bagged and boxed
                with care.
              </p>
            ),
          },
          {
            icon: "✦",
            title: "Need Help?",
            content: (
              <p style={bodyText}>
                For delivery assistance, bulk retail orders, or tracking queries, contact us at{" "}
                <a href="mailto:contact@revakalp.com" style={{ color: "#c9487c", fontWeight: 600 }}>
                  contact@revakalp.com
                </a>{" "}
                or WhatsApp us at <strong style={{ color: "#c9487c" }}>+91 91096-76562</strong>.
              </p>
            ),
          },
        ].map((item, i, arr) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "24px 1fr", gap: 20,
            paddingBottom: i < arr.length - 1 ? 36 : 0,
            marginBottom: i < arr.length - 1 ? 36 : 0,
            borderBottom: i < arr.length - 1 ? "1px solid #fce7f3" : "none",
          }}>
            <span style={{ color: "#c9487c", fontSize: "0.8rem", fontWeight: 700, marginTop: 6 }}>{item.icon}</span>
            <div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem", color: "#831843", marginBottom: 12,
              }}>{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>

    <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
  </div>
);

export default Delivery;
