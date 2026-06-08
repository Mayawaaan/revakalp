import React from "react";

/**
 * Reusable premium page hero for all informational pages.
 * Props: label (eyebrow), title, subtitle
 */
const PageHero = ({ label, title, subtitle }) => (
  <div
    style={{
      position: "relative",
      textAlign: "center",
      padding: "96px 32px 80px",
      background: "linear-gradient(135deg, #1a0010 0%, #3d0030 45%, #7a1045 80%, #c9487c 100%)",
      overflow: "hidden",
    }}
  >
    {/* Orb 1 */}
    <div style={{
      position: "absolute", top: "-15%", left: "-5%",
      width: 420, height: 420, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201,72,124,0.3) 0%, transparent 70%)",
      pointerEvents: "none",
    }} />
    {/* Orb 2 */}
    <div style={{
      position: "absolute", bottom: "-15%", right: "-5%",
      width: 320, height: 320, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
      pointerEvents: "none",
    }} />
    {/* Silk dot pattern */}
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.025'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
    }} />

    <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
      {label && (
        <p style={{
          textTransform: "uppercase", letterSpacing: "0.4em",
          fontSize: 11, color: "#f9a8d4", marginBottom: 16,
          fontFamily: "'Inter', sans-serif",
        }}>{label}</p>
      )}
      <h1 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
        color: "#fff", lineHeight: 1.15, marginBottom: 20,
      }}>{title}</h1>
      {subtitle && (
        <p style={{
          color: "#fce7f3", fontSize: "1.05rem", lineHeight: 1.8,
          maxWidth: 560, margin: "0 auto",
          fontFamily: "'Inter', sans-serif",
        }}>{subtitle}</p>
      )}
    </div>

    <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
  </div>
);

export default PageHero;
