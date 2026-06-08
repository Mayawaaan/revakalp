import React, { useState } from "react";
import useStore from "../../../store/store";
import CartTotal from "../../../components/cart/CartTotal";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ShieldCheck, RotateCcw } from "lucide-react";

const Cart = () => {
  const {
    currency, cart,
    incrementQuantity, decrementQuantity, removeFromCart,
    applyCoupon, discountPercentage, removeCoupon, showToast,
  } = useStore();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { showToast("Please enter a coupon code", "error"); return; }
    try {
      await applyCoupon(couponCode.trim());
      showToast("Coupon applied successfully", "success");
    } catch (error) {
      showToast(error.message || "Invalid coupon code", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff9fb", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Dark Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a0010 0%, #3d0030 45%, #7a1045 80%, #c9487c 100%)",
        padding: "80px 32px 60px", position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-5%",
          width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,72,124,0.3) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.4em", fontSize: 11, color: "#f9a8d4", marginBottom: 14 }}>
            Secure Checkout
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", marginBottom: 12,
          }}>Your Shopping Bag</h1>
          <p style={{ color: "#fce7f3", fontSize: "0.92rem", opacity: 0.85 }}>
            Review your selected pieces before placing your order.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 32px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32, alignItems: "start" }}>

          {/* ── Cart Items ── */}
          <div>
            {cart.length === 0 ? (
              <div style={{
                background: "#fff", borderRadius: 28, padding: "80px 40px",
                textAlign: "center", border: "1px solid #fce7f3",
                boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
              }}>
                <ShoppingBag size={56} style={{ color: "#f9a8d4", margin: "0 auto 24px" }} strokeWidth={1.2} />
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem", color: "#831843", marginBottom: 12,
                }}>Your bag is empty</h2>
                <p style={{ color: "#9d174d", fontSize: "0.9rem", marginBottom: 32, lineHeight: 1.7 }}>
                  Discover our curated collection of handloom sarees and lehengas.
                </p>
                <button onClick={() => navigate("/shop")} style={{
                  background: "linear-gradient(135deg, #c9487c, #7a1045)",
                  color: "#fff", padding: "13px 36px", borderRadius: 50,
                  border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
                  boxShadow: "0 6px 24px rgba(201,72,124,0.35)",
                  fontFamily: "'Inter', sans-serif",
                }}>Browse Collections</button>
              </div>
            ) : (
              <div style={{
                background: "#fff", borderRadius: 28, overflow: "hidden",
                border: "1px solid #fce7f3",
                boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
              }}>
                {/* Header row */}
                <div style={{
                  padding: "20px 32px",
                  background: "linear-gradient(135deg, #fce7f3, #fff1f4)",
                  borderBottom: "1px solid #fce7f3",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <p style={{ color: "#831843", fontWeight: 700, fontSize: "0.9rem" }}>
                    {cart.length} {cart.length === 1 ? "item" : "items"} in your bag
                  </p>
                  <button onClick={() => navigate("/shop")} style={{
                    color: "#c9487c", fontSize: "0.82rem", fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}>+ Add More</button>
                </div>

                {cart.map((item, idx) => {
                  const image = Array.isArray(item.image) ? item.image[0] : item.image;
                  const hasDiscount = item.discountedPrice && item.discountedPrice < item.price;
                  return (
                    <div key={`${item._id}-${item.size}`} style={{
                      display: "flex", gap: 20, padding: "24px 32px",
                      alignItems: "center",
                      borderBottom: idx < cart.length - 1 ? "1px solid #fce7f3" : "none",
                    }}>
                      {image && (
                        <img src={image} alt={item.name || "Product"} style={{
                          width: 88, height: 104, objectFit: "cover",
                          borderRadius: 14, flexShrink: 0,
                          boxShadow: "0 4px 16px rgba(201,72,124,0.12)",
                        }} />
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: "1rem", color: "#831843", marginBottom: 6,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{item.name || "Product"}</h3>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{
                            color: hasDiscount ? "#9ca3af" : "#9d174d",
                            textDecoration: hasDiscount ? "line-through" : "none",
                            fontSize: "0.88rem",
                          }}>{currency}{item.price}</span>
                          {hasDiscount && (
                            <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.88rem" }}>
                              {currency}{item.discountedPrice}
                            </span>
                          )}
                          {item.discount > 0 && (
                            <span style={{
                              background: "#fef2f2", color: "#dc2626",
                              fontSize: "0.72rem", fontWeight: 700,
                              padding: "2px 8px", borderRadius: 20,
                            }}>-{item.discount}%</span>
                          )}
                        </div>

                        {item.size && item.size !== "NO_SIZE" && (
                          <span style={{
                            display: "inline-block", marginTop: 6,
                            background: "#fce7f3", color: "#c9487c",
                            fontSize: "0.72rem", fontWeight: 600,
                            padding: "3px 10px", borderRadius: 20,
                            textTransform: "uppercase", letterSpacing: "0.05em",
                          }}>Size: {item.size}</span>
                        )}
                      </div>

                      {/* Qty stepper */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: 0,
                        background: "#fff9fb", borderRadius: 50,
                        border: "1.5px solid #fce7f3", overflow: "hidden",
                        flexShrink: 0,
                      }}>
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() => decrementQuantity(item._id, item.size)}
                          style={{
                            width: 36, height: 36, background: "none", border: "none",
                            cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                            color: item.quantity <= 1 ? "#fbbf24" : "#c9487c",
                            fontSize: "1.1rem", fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >−</button>
                        <span style={{ width: 28, textAlign: "center", color: "#831843", fontSize: "0.9rem", fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item._id, item.size)}
                          style={{
                            width: 36, height: 36, background: "none", border: "none",
                            cursor: "pointer", color: "#c9487c",
                            fontSize: "1.1rem", fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >+</button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item._id, item.size)}
                        style={{
                          background: "#fef2f2", border: "none", borderRadius: 10,
                          width: 36, height: 36, display: "flex", alignItems: "center",
                          justifyContent: "center", cursor: "pointer", flexShrink: 0,
                          color: "#ef4444", transition: "background 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div style={{ position: "sticky", top: 100 }}>
            <div style={{
              background: "#fff", borderRadius: 28,
              border: "1px solid #fce7f3",
              boxShadow: "0 12px 48px rgba(201,72,124,0.12)",
              overflow: "hidden",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #1a0010, #3d0030)",
                padding: "20px 28px",
              }}>
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#fff", fontSize: "1.1rem",
                }}>Order Summary</p>
              </div>

              <div style={{ padding: "28px" }}>
                <CartTotal />

                {/* Coupon */}
                <div style={{ marginTop: 24 }}>
                  <p style={{ color: "#9d174d", fontSize: "0.82rem", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Promo Code
                  </p>
                  {discountPercentage > 0 ? (
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: "#f0fdf4", borderRadius: 12, padding: "12px 16px",
                      border: "1px solid #bbf7d0",
                    }}>
                      <p style={{ color: "#15803d", fontSize: "0.85rem", fontWeight: 600 }}>✓ Coupon Applied!</p>
                      <button onClick={removeCoupon} style={{
                        color: "#dc2626", fontSize: "0.78rem", fontWeight: 700,
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                      }}>Remove</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter code"
                        style={{
                          flex: 1, padding: "12px 16px",
                          borderRadius: 12, border: "1.5px solid #fce7f3",
                          fontSize: "0.88rem", color: "#831843", outline: "none",
                          background: "#fff9fb",
                          fontFamily: "'Inter', sans-serif",
                        }}
                        onFocus={e => e.target.style.borderColor = "#c9487c"}
                        onBlur={e => e.target.style.borderColor = "#fce7f3"}
                      />
                      <button onClick={handleApplyCoupon} style={{
                        background: "linear-gradient(135deg, #c9487c, #7a1045)",
                        color: "#fff", padding: "12px 18px", borderRadius: 12,
                        border: "none", cursor: "pointer", fontWeight: 600,
                        fontSize: "0.82rem", flexShrink: 0,
                        fontFamily: "'Inter', sans-serif",
                      }}>Apply</button>
                    </div>
                  )}
                </div>

                {/* Checkout btn */}
                <button
                  disabled={cart.length === 0}
                  onClick={() => navigate("/place-order")}
                  style={{
                    width: "100%", marginTop: 24, padding: "16px",
                    borderRadius: 50, border: "none",
                    background: cart.length === 0
                      ? "#e5e7eb"
                      : "linear-gradient(135deg, #c9487c, #7a1045)",
                    color: cart.length === 0 ? "#9ca3af" : "#fff",
                    fontWeight: 700, fontSize: "0.95rem",
                    cursor: cart.length === 0 ? "not-allowed" : "pointer",
                    boxShadow: cart.length === 0 ? "none" : "0 8px 28px rgba(201,72,124,0.4)",
                    transition: "transform 0.2s",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={e => { if (cart.length > 0) e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                >
                  Proceed to Checkout →
                </button>

                {/* Trust badges */}
                <div style={{
                  display: "flex", justifyContent: "center", gap: 20,
                  marginTop: 20, flexWrap: "wrap",
                }}>
                  {[
                    { icon: <ShieldCheck size={13} />, text: "Secure Payment" },
                    { icon: <RotateCcw size={13} />, text: "Easy Returns" },
                  ].map((badge, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, color: "#9d174d", fontSize: "0.72rem" }}>
                      {badge.icon}
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
    </div>
  );
};

export default Cart;
