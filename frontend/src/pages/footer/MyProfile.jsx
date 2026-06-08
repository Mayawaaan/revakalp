import React, { useState, useRef, useEffect } from "react";
import useStore from "../../store/store";
import useAuth from "../../hooks/useAuth";
import { Upload, Edit, Save, X, Shield, Mail, User } from "lucide-react";

const MyProfile = () => {
  const { user } = useStore();
  const { handleUpdateProfile } = useAuth();

  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) setFullName(user.fullName);
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
  };

  const handleUpdate = async () => {
    await handleUpdateProfile({ fullName, profilePic });
    setProfilePic(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setProfilePic(null);
    setIsEditing(false);
  };

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fff9fb",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          background: "#fff", borderRadius: 28, padding: "56px 48px",
          textAlign: "center", maxWidth: 420,
          boxShadow: "0 12px 48px rgba(201,72,124,0.12)",
          border: "1px solid #fce7f3",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: 20 }}>🔒</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem", color: "#831843", marginBottom: 12,
          }}>Sign In Required</h1>
          <p style={{ color: "#9d174d", fontSize: "0.9rem", lineHeight: 1.7 }}>
            Please sign in to view and manage your profile.
          </p>
        </div>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
      </div>
    );
  }

  const avatarSrc = profilePic
    ? URL.createObjectURL(profilePic)
    : user.profilePic || null;

  return (
    <div style={{ minHeight: "100vh", background: "#fff9fb", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Dark Hero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a0010 0%, #3d0030 45%, #7a1045 80%, #c9487c 100%)",
        padding: "80px 32px 120px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,72,124,0.3) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", right: "-5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <p style={{ textTransform: "uppercase", letterSpacing: "0.4em", fontSize: 11, color: "#f9a8d4", marginBottom: 14 }}>
            Account
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff",
          }}>My Profile</h1>
        </div>
      </div>

      {/* ── Profile Card (overlapping hero) ── */}
      <div style={{ maxWidth: 760, margin: "-72px auto 80px", padding: "0 24px", position: "relative", zIndex: 10 }}>
        <div style={{
          background: "#fff", borderRadius: 32,
          boxShadow: "0 24px 80px rgba(201,72,124,0.18)",
          border: "1px solid #fce7f3", overflow: "hidden",
        }}>

          {/* Avatar section */}
          <div style={{
            background: "linear-gradient(135deg, #fce7f3, #fff1f4)",
            padding: "48px 40px 36px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            borderBottom: "1px solid #fce7f3",
          }}>
            <div
              style={{
                width: 110, height: 110, borderRadius: "50%", overflow: "hidden",
                cursor: isEditing ? "pointer" : "default",
                boxShadow: "0 0 0 4px #fff, 0 0 0 7px #c9487c44",
                position: "relative", flexShrink: 0,
              }}
              onClick={() => isEditing && fileInputRef.current.click()}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: "linear-gradient(135deg, #c9487c, #7a1045)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2.5rem", color: "#fff",
                  fontFamily: "'Playfair Display', serif",
                }}>
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff",
                }}>
                  <Upload size={22} />
                </div>
              )}
            </div>

            <div style={{ textAlign: "center" }}>
              {isEditing ? (
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.6rem", color: "#831843",
                    background: "transparent",
                    border: "none", borderBottom: "2px solid #c9487c",
                    outline: "none", textAlign: "center",
                    width: 260,
                  }}
                />
              ) : (
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.8rem", color: "#831843",
                }}>{user.fullName}</h2>
              )}
              <p style={{
                color: "#c9487c", fontSize: "0.78rem", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 6,
              }}>Revakalp Member</p>
            </div>
          </div>

          {/* Info rows */}
          <div style={{ padding: "36px 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
              {[
                { icon: <User size={16} />, label: "Full Name", value: user.fullName },
                { icon: <Mail size={16} />, label: "Email Address", value: user.email },
              ].map((field, i) => (
                <div key={i} style={{
                  background: "#fff9fb", borderRadius: 16, padding: "20px 22px",
                  border: "1px solid #fce7f3",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: "#c9487c" }}>
                    {field.icon}
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {field.label}
                    </span>
                  </div>
                  <p style={{ color: "#831843", fontSize: "0.95rem", fontWeight: 500 }}>{field.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {isEditing ? (
                <>
                  <button onClick={handleUpdate} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "linear-gradient(135deg, #c9487c, #7a1045)",
                    color: "#fff", padding: "12px 28px", borderRadius: 50,
                    border: "none", cursor: "pointer", fontWeight: 600,
                    fontSize: "0.88rem", boxShadow: "0 4px 16px rgba(201,72,124,0.35)",
                    transition: "transform 0.2s",
                    fontFamily: "'Inter', sans-serif",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = ""}
                  >
                    <Save size={16} /> Save Changes
                  </button>
                  <button onClick={handleCancel} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#f3f4f6", color: "#374151",
                    padding: "12px 28px", borderRadius: 50,
                    border: "none", cursor: "pointer", fontWeight: 500,
                    fontSize: "0.88rem", fontFamily: "'Inter', sans-serif",
                  }}>
                    <X size={16} /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#fce7f3", color: "#831843",
                  padding: "12px 28px", borderRadius: 50,
                  border: "1.5px solid #fbbf2440", cursor: "pointer",
                  fontWeight: 600, fontSize: "0.88rem",
                  transition: "background 0.2s",
                  fontFamily: "'Inter', sans-serif",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fbcfe8"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fce7f3"}
                >
                  <Edit size={16} /> Edit Profile
                </button>
              )}
            </div>

            {/* Security note */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
              marginTop: 24, color: "#9d174d", fontSize: "0.8rem",
            }}>
              <Shield size={14} />
              <span>Your information is securely stored and never shared without consent.</span>
            </div>
          </div>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');`}</style>
    </div>
  );
};

export default MyProfile;
