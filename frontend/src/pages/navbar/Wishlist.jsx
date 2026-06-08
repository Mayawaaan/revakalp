import React from "react";
import useStore from "../../store/store";
import ProductItem from "../../components/products/ProductItem";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { wishlist, wishlistLoading } = useStore();

  return (
    <div style={{ minHeight: "100vh", background: "#fff9fb", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Dark Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a0010 0%, #3d0030 45%, #7a1045 80%, #c9487c 100%)",
        padding: "80px 32px 60px", position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-5%",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,72,124,0.3) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.4em", fontSize: 11, color: "#f9a8d4", marginBottom: 14 }}>
            Saved Pieces
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", marginBottom: 12,
          }}>My Wishlist</h1>
          <p style={{ color: "#fce7f3", fontSize: "0.95rem", opacity: 0.85 }}>
            Your favourite pieces, waiting to become yours.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "60px 32px 100px" }}>

        {/* Loading */}
        {wishlistLoading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              border: "3px solid #fce7f3", borderTopColor: "#c9487c",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 20px",
            }} />
            <p style={{ color: "#9d174d" }}>Loading your wishlist…</p>
          </div>
        )}

        {/* Empty */}
        {!wishlistLoading && (!wishlist || wishlist.items.length === 0) && (
          <div style={{
            textAlign: "center", padding: "80px 32px",
            background: "#fff", borderRadius: 32,
            border: "1px solid #fce7f3",
            boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
          }}>
            <Heart size={56} style={{ color: "#f9a8d4", margin: "0 auto 24px" }} strokeWidth={1.2} />
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem", color: "#831843", marginBottom: 12,
            }}>Your wishlist is empty</h2>
            <p style={{ color: "#9d174d", fontSize: "0.9rem", marginBottom: 32, lineHeight: 1.7 }}>
              Start saving beautiful pieces you love — they'll appear here.
            </p>
            <Link to="/shop" style={{
              background: "linear-gradient(135deg, #c9487c, #7a1045)",
              color: "#fff", padding: "13px 36px", borderRadius: 50,
              textDecoration: "none", fontWeight: 600, fontSize: "0.9rem",
              boxShadow: "0 6px 24px rgba(201,72,124,0.35)",
              display: "inline-block",
            }}>
              Browse Collections
            </Link>
          </div>
        )}

        {/* Items grid */}
        {!wishlistLoading && wishlist && wishlist.items.length > 0 && (
          <>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 32,
            }}>
              <div>
                <p style={{ color: "#9d174d", fontSize: "0.9rem" }}>
                  <span style={{ fontWeight: 700, color: "#831843" }}>
                    {wishlist.items.filter(i => i.product).length}
                  </span> {wishlist.items.filter(i => i.product).length === 1 ? "piece" : "pieces"} saved
                </p>
              </div>
              <Link to="/shop" style={{
                color: "#c9487c", fontSize: "0.85rem", fontWeight: 600,
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
              }}>+ Add More →</Link>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}>
              {wishlist.items.filter(item => item.product).map((item) => (
                <div
                  key={item.product._id}
                  style={{
                    background: "#fff", borderRadius: 20,
                    border: "1px solid #fce7f3",
                    boxShadow: "0 4px 20px rgba(201,72,124,0.07)",
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 16px 48px rgba(201,72,124,0.18)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,72,124,0.07)";
                  }}
                >
                  <ProductItem
                    id={item.product._id}
                    name={item.product.name}
                    price={item.product.price}
                    image={item.product.image}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Wishlist;
