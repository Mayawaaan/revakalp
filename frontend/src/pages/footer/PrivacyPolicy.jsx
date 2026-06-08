import React from "react";
import PageHero from "../../components/globalComponents/PageHero";

/* ── Shared policy section renderer ── */
const PolicySection = ({ number, title, children }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "40px 1fr", gap: 24,
    paddingBottom: 40, marginBottom: 40,
    borderBottom: "1px solid #fce7f3",
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      background: "linear-gradient(135deg, #c9487c, #7a1045)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: "0.8rem", fontWeight: 700,
      flexShrink: 0, marginTop: 4,
      boxShadow: "0 4px 12px rgba(201,72,124,0.3)",
    }}>{number}</div>
    <div>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.2rem", color: "#831843", marginBottom: 14,
      }}>{title}</h3>
      {children}
    </div>
  </div>
);

const bodyText = { color: "#9d174d", fontSize: "0.92rem", lineHeight: 1.85 };
const listStyle = { color: "#9d174d", fontSize: "0.88rem", lineHeight: 1.85, paddingLeft: 20, marginTop: 10 };

const PrivacyPolicy = () => (
  <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff9fb" }}>

    <PageHero
      label="Your Privacy"
      title="Privacy Policy"
      subtitle="At Revakalp, your privacy is deeply respected. This policy explains how we collect, use, and safeguard your personal information."
    />

    <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px 100px" }}>

      {/* Updated badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "#fce7f3", borderRadius: 20, padding: "8px 18px",
        marginBottom: 48,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c9487c", display: "inline-block" }} />
        <span style={{ color: "#9d174d", fontSize: "0.78rem", letterSpacing: "0.05em" }}>
          Last updated: June 2025
        </span>
      </div>

      <div style={{
        background: "#fff", borderRadius: 28,
        border: "1px solid #fce7f3",
        boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
        padding: "52px 56px",
      }}>
        <PolicySection number="01" title="Information We Collect">
          <p style={bodyText}>When you browse our website or place an order, we may collect:</p>
          <ul style={listStyle}>
            <li>Name, email address, phone number, and delivery address</li>
            <li>Order and transaction details</li>
            <li>Basic device and browser information</li>
          </ul>
        </PolicySection>

        <PolicySection number="02" title="How We Use Your Information">
          <p style={bodyText}>Your information is used strictly to:</p>
          <ul style={listStyle}>
            <li>Process and fulfill orders</li>
            <li>Communicate order updates and provide customer support</li>
            <li>Improve our website experience and services</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </PolicySection>

        <PolicySection number="03" title="Data Protection & Security">
          <p style={bodyText}>
            We take reasonable security measures to protect your personal data against
            unauthorized access, misuse, or disclosure. Payment details are processed
            through secure payment gateways and are never stored on our servers.
          </p>
        </PolicySection>

        <PolicySection number="04" title="Sharing of Information">
          <p style={bodyText}>
            We do not sell, rent, or trade your personal information. Data is shared only
            with trusted partners such as delivery services or payment processors, solely
            for order fulfillment.
          </p>
        </PolicySection>

        <PolicySection number="05" title="Cookies">
          <p style={bodyText}>
            Our website may use cookies to enhance your browsing experience, analyze site
            traffic, and understand user preferences. You may disable cookies via your
            browser settings at any time.
          </p>
        </PolicySection>

        <PolicySection number="06" title="Your Rights">
          <p style={bodyText}>
            You have the right to access, update, or request deletion of your personal
            information at any time. Please contact us and we will respond within 48 hours.
          </p>
        </PolicySection>

        <div style={{ paddingTop: 8 }}>
          <PolicySection number="07" title="Updates to This Policy">
            <p style={bodyText}>
              This Privacy Policy may be updated periodically to reflect changes in our
              practices or legal requirements. Continued use of our website implies
              acceptance of the updated policy.
            </p>
          </PolicySection>
        </div>

        {/* Contact footer */}
        <div style={{
          background: "linear-gradient(135deg, #fce7f3, #fff1f4)",
          borderRadius: 16, padding: "28px 32px", textAlign: "center",
          marginTop: 8,
        }}>
          <p style={{ color: "#9d174d", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Questions about this policy? Write to us at{" "}
            <a href="mailto:contact@revakalp.com" style={{ color: "#c9487c", fontWeight: 600 }}>
              contact@revakalp.com
            </a>
          </p>
        </div>
      </div>
    </div>

    <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
  </div>
);

export default PrivacyPolicy;
