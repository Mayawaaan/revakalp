import React from "react";
import PageHero from "../../components/globalComponents/PageHero";

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

const Terms = () => (
  <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff9fb" }}>

    <PageHero
      label="Legal"
      title="Terms & Conditions"
      subtitle="By accessing our website or making a purchase, you agree to the conditions described below. Please read them carefully."
    />

    <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px 100px" }}>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "#fce7f3", borderRadius: 20, padding: "8px 18px",
        marginBottom: 48,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c9487c", display: "inline-block" }} />
        <span style={{ color: "#9d174d", fontSize: "0.78rem", letterSpacing: "0.05em" }}>Last updated: June 2025</span>
      </div>

      <div style={{
        background: "#fff", borderRadius: 28,
        border: "1px solid #fce7f3",
        boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
        padding: "52px 56px",
      }}>
        <PolicySection number="01" title="General Information">
          <p style={bodyText}>
            Revakalp is an online platform offering curated Indian apparel and textiles.
            All content, products, and services provided on this website are subject to these terms.
          </p>
        </PolicySection>

        <PolicySection number="02" title="Products & Descriptions">
          <p style={bodyText}>
            We strive to display product details, colors, and descriptions as accurately as possible.
            Minor variations may occur due to lighting, screen settings, or the handcrafted nature
            of our products.
          </p>
        </PolicySection>

        <PolicySection number="03" title="Pricing & Availability">
          <p style={bodyText}>
            Prices are subject to change without prior notice. All orders are subject to availability
            and confirmation. In rare cases, we may cancel or limit quantities at our discretion.
          </p>
        </PolicySection>

        <PolicySection number="04" title="Orders & Payments">
          <p style={bodyText}>
            By placing an order, you confirm that the information provided is accurate and complete.
            Payments must be made through our approved payment methods. Revakalp reserves the right
            to refuse or cancel any order if fraud or misuse is suspected.
          </p>
        </PolicySection>

        <PolicySection number="05" title="Returns & Refunds">
          <p style={bodyText}>
            Our return and exchange policies are outlined on the Returns & Exchanges page. By placing
            an order, you acknowledge and agree to those policies.
          </p>
        </PolicySection>

        <PolicySection number="06" title="Intellectual Property">
          <p style={bodyText}>
            All content on this website — including images, text, logos, and designs — is the
            property of Revakalp and may not be used, reproduced, or distributed without prior
            written permission.
          </p>
        </PolicySection>

        <PolicySection number="07" title="Limitation of Liability">
          <p style={bodyText}>
            Revakalp shall not be liable for any indirect, incidental, or consequential damages
            arising from the use of our website or products, to the extent permitted by law.
          </p>
        </PolicySection>

        <div style={{ paddingTop: 8 }}>
          <PolicySection number="08" title="Changes to Terms">
            <p style={bodyText}>
              We reserve the right to update or modify these terms at any time. Continued use of
              the website after changes indicates acceptance of the updated terms.
            </p>
          </PolicySection>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #fce7f3, #fff1f4)",
          borderRadius: 16, padding: "28px 32px", textAlign: "center", marginTop: 8,
        }}>
          <p style={{ color: "#9d174d", fontSize: "0.9rem", lineHeight: 1.7 }}>
            For any questions regarding these terms, contact us at{" "}
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

export default Terms;
