import React, { useEffect } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  PackageCheck, Truck, Clock, XCircle,
  RefreshCw, Download, ShoppingBag, Loader2
} from "lucide-react";

const STATUS_CONFIG = {
  Placed:    { icon: <Clock size={16} />,        color: "#d97706", bg: "#fffbeb", border: "#fde68a", label: "Order Placed" },
  Shipped:   { icon: <Truck size={16} />,         color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", label: "Shipped" },
  Delivered: { icon: <PackageCheck size={16} />,  color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", label: "Delivered" },
  Cancelled: { icon: <XCircle size={16} />,       color: "#dc2626", bg: "#fef2f2", border: "#fecaca", label: "Cancelled" },
};

const Orders = () => {
  const { orders, currency, orderLoading, fetchOrders, reorderItems, downloadInvoice, showToast } = useStore();
  const navigate = useNavigate();

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleDownloadInvoice = async (orderId) => {
    try { await downloadInvoice(orderId); }
    catch { showToast("Failed to download invoice", "error"); }
  };

  /* ── Loading ── */
  if (orderLoading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fff9fb", fontFamily: "'Inter', sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={44} style={{ color: "#c9487c", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#9d174d" }}>Fetching your orders…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Empty ── */
  if (!orders || orders.length === 0) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fff9fb", fontFamily: "'Inter', sans-serif",
      }}>
        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #1a0010 0%, #3d0030 45%, #7a1045 80%, #c9487c 100%)",
          padding: "80px 32px 60px", textAlign: "center",
        }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.4em", fontSize: 11, color: "#f9a8d4", marginBottom: 14 }}>My Account</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: "#fff" }}>My Orders</h1>
        </div>
        <div style={{
          maxWidth: 500, margin: "60px auto", padding: "80px 40px",
          background: "#fff", borderRadius: 32, textAlign: "center",
          border: "1px solid #fce7f3", boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
        }}>
          <ShoppingBag size={60} style={{ color: "#f9a8d4", margin: "0 auto 24px" }} strokeWidth={1.2} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#831843", marginBottom: 12 }}>
            No Orders Yet
          </h2>
          <p style={{ color: "#9d174d", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 32 }}>
            Once you place your first order, it will appear here.
          </p>
          <button onClick={() => navigate("/shop")} style={{
            background: "linear-gradient(135deg, #c9487c, #7a1045)",
            color: "#fff", padding: "13px 36px", borderRadius: 50,
            border: "none", cursor: "pointer", fontWeight: 600,
            fontSize: "0.9rem", boxShadow: "0 6px 24px rgba(201,72,124,0.35)",
            fontFamily: "'Inter', sans-serif",
          }}>Start Shopping</button>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff9fb", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Dark Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a0010 0%, #3d0030 45%, #7a1045 80%, #c9487c 100%)",
        padding: "80px 32px 60px", position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        <div style={{
          position: "absolute", bottom: "-20%", right: "-5%",
          width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,72,124,0.3) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.4em", fontSize: 11, color: "#f9a8d4", marginBottom: 14 }}>
            My Account
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", marginBottom: 12,
          }}>My Orders</h1>
          <p style={{ color: "#fce7f3", fontSize: "0.92rem", opacity: 0.85 }}>
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 32px 100px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.Placed;

            return (
              <div key={order._id} style={{
                background: "#fff", borderRadius: 28,
                border: "1px solid #fce7f3",
                boxShadow: "0 8px 40px rgba(201,72,124,0.08)",
                overflow: "hidden",
              }}>
                {/* Order header */}
                <div style={{
                  background: "linear-gradient(135deg, #fff1f4, #fce7f3)",
                  padding: "20px 32px",
                  display: "flex", flexWrap: "wrap", gap: 24,
                  justifyContent: "space-between", alignItems: "center",
                  borderBottom: "1px solid #fce7f3",
                }}>
                  <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                    {[
                      { label: "Order ID", val: `#${order._id.slice(-8).toUpperCase()}` },
                      { label: "Placed On", val: new Date(order.createdAt || order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                      { label: "Total", val: `${currency}${order.total}` },
                    ].map((meta, i) => (
                      <div key={i}>
                        <p style={{ color: "#c9487c", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                          {meta.label}
                        </p>
                        <p style={{ color: "#831843", fontWeight: 600, fontSize: "0.92rem" }}>{meta.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Status badge */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: status.bg, borderRadius: 20, padding: "8px 16px",
                    border: `1px solid ${status.border}`,
                  }}>
                    <span style={{ color: status.color }}>{status.icon}</span>
                    <span style={{ color: status.color, fontSize: "0.82rem", fontWeight: 700 }}>{status.label}</span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: "0 32px" }}>
                  {order.items.map((item, idx) => (
                    <div key={item._id || idx} style={{
                      display: "flex", gap: 18, alignItems: "center",
                      padding: "20px 0",
                      borderBottom: idx < order.items.length - 1 ? "1px solid #fce7f3" : "none",
                    }}>
                      <img
                        src={Array.isArray(item.image) ? item.image[0] : item.image}
                        alt={item.name}
                        style={{
                          width: 72, height: 86, objectFit: "cover",
                          borderRadius: 12, flexShrink: 0,
                          boxShadow: "0 4px 12px rgba(201,72,124,0.1)",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontFamily: "'Playfair Display', serif",
                          color: "#831843", fontSize: "1rem", marginBottom: 6,
                        }}>{item.name}</h4>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <span style={{
                            background: "#fce7f3", color: "#c9487c",
                            fontSize: "0.72rem", fontWeight: 600,
                            padding: "3px 10px", borderRadius: 20,
                          }}>{currency}{item.price}</span>
                          {item.size && item.size !== "NO_SIZE" && (
                            <span style={{
                              background: "#fff1f4", color: "#9d174d",
                              fontSize: "0.72rem", padding: "3px 10px", borderRadius: 20,
                            }}>Size: {item.size}</span>
                          )}
                          <span style={{
                            background: "#fff1f4", color: "#9d174d",
                            fontSize: "0.72rem", padding: "3px 10px", borderRadius: 20,
                          }}>Qty: {item.quantity || item.qty}</span>
                        </div>
                      </div>
                      <p style={{ fontWeight: 700, color: "#831843", flexShrink: 0 }}>
                        {currency}{item.price * (item.quantity || item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Refund notice */}
                {order.refund && (
                  <div style={{
                    margin: "0 32px 8px",
                    background: "#f0fdf4", borderRadius: 12, padding: "12px 16px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <PackageCheck size={16} style={{ color: "#16a34a" }} />
                    <p style={{ color: "#15803d", fontSize: "0.85rem" }}>
                      Refund of {currency}{order.refund.amount} processed on {order.refund.date}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  padding: "16px 32px 24px",
                  display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end",
                }}>
                  <button onClick={() => navigate(`/track/${order._id}`)} style={{
                    background: "linear-gradient(135deg, #c9487c, #7a1045)",
                    color: "#fff", padding: "10px 22px", borderRadius: 50,
                    border: "none", cursor: "pointer", fontWeight: 600,
                    fontSize: "0.82rem", boxShadow: "0 4px 16px rgba(201,72,124,0.3)",
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "'Inter', sans-serif",
                    transition: "transform 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = ""}
                  >
                    <Truck size={14} /> Track Order
                  </button>

                  <button onClick={() => handleDownloadInvoice(order._id)} style={{
                    background: "#fff", color: "#831843",
                    padding: "10px 22px", borderRadius: 50,
                    border: "1.5px solid #fce7f3", cursor: "pointer",
                    fontWeight: 600, fontSize: "0.82rem",
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "'Inter', sans-serif",
                    transition: "background 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff1f4"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <Download size={14} /> Invoice
                  </button>

                  <button onClick={async () => {
                    try { await reorderItems(order._id); navigate("/cart"); }
                    catch (err) { console.error(err); }
                  }} style={{
                    background: "#fff", color: "#831843",
                    padding: "10px 22px", borderRadius: 50,
                    border: "1.5px solid #fce7f3", cursor: "pointer",
                    fontWeight: 600, fontSize: "0.82rem",
                    display: "flex", alignItems: "center", gap: 6,
                    fontFamily: "'Inter', sans-serif",
                    transition: "background 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff1f4"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <RefreshCw size={14} /> Reorder
                  </button>

                  {order.status === "Delivered" && (
                    <button style={{
                      background: "#fff", color: "#831843",
                      padding: "10px 22px", borderRadius: 50,
                      border: "1.5px solid #fce7f3", cursor: "pointer",
                      fontWeight: 600, fontSize: "0.82rem",
                      fontFamily: "'Inter', sans-serif",
                    }}>Return / Exchange</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Orders;
