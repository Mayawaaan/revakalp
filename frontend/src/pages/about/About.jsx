import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NewsletterBox from "../../components/homepage/NewsletterBox";

/* ─── Intersection Observer hook for scroll-reveal ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Section Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════ */
const About = () => {
  return (
    <div className="overflow-x-hidden font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ═══ 1. CINEMATIC HERO ═══ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          background: "linear-gradient(135deg, #1a0010 0%, #3d0030 40%, #7a1045 70%, #c9487c 100%)",
        }}
      >
        {/* Animated orbs */}
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,72,124,0.35) 0%, transparent 70%)",
          animation: "pulse 6s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,180,210,0.2) 0%, transparent 70%)",
          animation: "pulse 8s ease-in-out infinite 2s",
        }} />

        {/* Silk texture overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p style={{
            textTransform: "uppercase", letterSpacing: "0.4em",
            fontSize: 11, color: "#f9a8d4", marginBottom: 20,
            animation: "fadeInDown 1s ease both",
          }}>
            Est. 2014 · Indore, Madhya Pradesh
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
            color: "#fff", lineHeight: 1.1, marginBottom: 24,
            animation: "fadeInDown 1s ease 0.2s both",
          }}>
            A Decade of{" "}
            <span style={{
              background: "linear-gradient(90deg, #fbbf24, #f9a8d4, #fbbf24)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}>Handpicked Elegance</span>
          </h1>
          <p style={{
            color: "#fce7f3", fontSize: "1.15rem", lineHeight: 1.8,
            maxWidth: 600, margin: "0 auto 40px",
            animation: "fadeInDown 1s ease 0.4s both",
          }}>
            From a humble lane in Indore to homes across India — Revakalp's journey
            is woven with passion, patience, and the finest threads of tradition.
          </p>
          <div style={{ animation: "fadeInDown 1s ease 0.6s both", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/shop" style={{
              background: "linear-gradient(135deg, #c9487c, #7a1045)",
              color: "#fff", padding: "14px 36px", borderRadius: 50,
              textDecoration: "none", fontSize: "0.9rem", fontWeight: 600,
              boxShadow: "0 8px 30px rgba(201,72,124,0.5)",
              transition: "transform 0.3s, box-shadow 0.3s",
              display: "inline-block",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,72,124,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 30px rgba(201,72,124,0.5)"; }}
            >
              Explore Our Collection
            </Link>
            <a href="#story" style={{
              border: "1.5px solid rgba(249,168,212,0.6)", color: "#fce7f3",
              padding: "14px 36px", borderRadius: 50,
              textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
              backdropFilter: "blur(8px)", display: "inline-block",
              transition: "background 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = ""}
            >
              Read Our Story ↓
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: "#f9a8d4", fontSize: 11, letterSpacing: "0.2em",
          animation: "bounce 2s ease infinite",
        }}>
          <span>SCROLL</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #f9a8d4, transparent)" }} />
        </div>
      </section>

      {/* ═══ 2. ORIGIN STORY — THE INDORE LANES ═══ */}
      <section id="story" style={{ background: "#fff9fb", padding: "120px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

            {/* Left — Visual card */}
            <Reveal delay={0}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: "100%", aspectRatio: "4/5", borderRadius: 32,
                  background: "linear-gradient(135deg, #fce7f3, #fbcfe8, #f9a8d4)",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", overflow: "hidden", position: "relative",
                  boxShadow: "0 32px 80px rgba(201,72,124,0.2)",
                }}>
                  {/* Decorative weave pattern */}
                  <div style={{
                    position: "absolute", inset: 0, opacity: 0.1,
                    backgroundImage: `repeating-linear-gradient(45deg, #c9487c 0, #c9487c 1px, transparent 0, transparent 50%),
                                      repeating-linear-gradient(-45deg, #c9487c 0, #c9487c 1px, transparent 0, transparent 50%)`,
                    backgroundSize: "30px 30px",
                  }} />

                  <div style={{
                    position: "relative", textAlign: "center",
                    background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
                    borderRadius: 24, padding: "40px 50px",
                    boxShadow: "0 8px 40px rgba(201,72,124,0.15)",
                  }}>
                    <div style={{ fontSize: "4rem", marginBottom: 12 }}>🏪</div>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.8rem", color: "#831843", marginBottom: 8,
                    }}>Indore, M.P.</p>
                    <p style={{ color: "#9d174d", fontSize: "0.9rem", letterSpacing: "0.1em" }}>
                      INDORE · 2014
                    </p>
                    <div style={{
                      margin: "20px 0", height: 1,
                      background: "linear-gradient(90deg, transparent, #c9487c, transparent)",
                    }} />
                    <p style={{ color: "#be185d", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 220 }}>
                      Where one shop window held the vision to grow and serve with handloom sarees and lenghas for the every bride to be.
                    </p>
                  </div>

                  {/* Floating badge */}
                  <div style={{
                    position: "absolute", top: 24, right: 24,
                    background: "linear-gradient(135deg, #c9487c, #7a1045)",
                    color: "#fff", borderRadius: 20, padding: "8px 16px",
                    fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em",
                    boxShadow: "0 4px 16px rgba(201,72,124,0.4)",
                  }}>
                    EST. 2014
                  </div>
                </div>

                {/* Floating stat */}
                <div style={{
                  position: "absolute", bottom: -24, right: -24,
                  background: "#fff", borderRadius: 20, padding: "20px 28px",
                  boxShadow: "0 16px 48px rgba(201,72,124,0.2)",
                  border: "1px solid #fce7f3",
                }}>
                  <p style={{ fontSize: "2.5rem", fontWeight: 800, color: "#c9487c", lineHeight: 1 }}>10+</p>
                  <p style={{ fontSize: "0.75rem", color: "#9d174d", marginTop: 4 }}>Years of Legacy</p>
                </div>
              </div>
            </Reveal>

            {/* Right — Story text */}
            <Reveal delay={0.2}>
              <div>
                <p style={{
                  textTransform: "uppercase", letterSpacing: "0.35em",
                  fontSize: 11, color: "#c9487c", marginBottom: 16,
                }}>
                  Our Origin Story
                </p>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#831843",
                  lineHeight: 1.2, marginBottom: 28,
                }}>
                  Born in the Lanes of Indore
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    "We, armed with an eye for fabric and a love for India's weaving traditions, began handpicking lehengas and handloom sarees for the women of our city.",
                    "Indore has always been a city of taste. Its people wear their culture proudly — at weddings, at festivals, and at every intimate family gathering. We saw this passion and matched it with our own: travelling to weavers in Chanderi, Maheshwar, and Banaras, selecting only what we ourselves would gift to our daughter.",
                    "Word spread lane by lane. Brides from across Indore started visiting the little shop that smelled of incense and fresh silk. They came for one saree and left with three.",
                  ].map((text, i) => (
                    <p key={i} style={{ color: "#9d174d", lineHeight: 1.9, fontSize: "1rem" }}>
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ 4. THE HANDPICKING PHILOSOPHY ═══ */}
      <section style={{ background: "#fff", padding: "120px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <p style={{ textTransform: "uppercase", letterSpacing: "0.35em", fontSize: 11, color: "#c9487c", marginBottom: 16 }}>
                The Revakalp Difference
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#831843",
                maxWidth: 700, margin: "0 auto", lineHeight: 1.25,
              }}>
                Every Piece is Handpicked. No Exceptions.
              </h2>
              <p style={{ color: "#9d174d", marginTop: 20, maxWidth: 580, margin: "20px auto 0", lineHeight: 1.8, fontSize: "1rem" }}>
                In a world of dropshipping and bulk imports, we do things differently.
                Our curator personally inspects each lehenga and saree before it earns
                a place in the Revakalp collection.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              {
                icon: "🔍",
                title: "Personal Curation",
                desc: "Every saree is touched, draped, and examined in person by our founder before it's photographed or listed. If it doesn't pass the drape test, it doesn't make the cut.",
                color: "#fce7f3",
                accent: "#c9487c",
              },
              {
                icon: "🌿",
                title: "Fabric Integrity",
                desc: "We test for zari purity, thread count, colour fastness, and shrinkage. Our customers expect heirloom quality — and we deliver exactly that.",
                color: "#fff1f4",
                accent: "#be185d",
              },
              {
                icon: "🤝",
                title: "Artisan Stories",
                desc: "We know the names of the weavers behind each piece. Their craft, their family's history, their village's tradition — all part of every Revakalp purchase.",
                color: "#fce7f3",
                accent: "#9d174d",
              },
              {
                icon: "📐",
                title: "Bridal Precision",
                desc: "Lehengas are measured, embroidery density checked, blouse fall verified — we treat bridal curation like a sacred responsibility.",
                color: "#fff1f4",
                accent: "#c9487c",
              },
              {
                icon: "🎨",
                title: "Seasonal Palettes",
                desc: "Each season, we travel to weavers and select colour stories that match the mood of weddings, festivals, and everyday grace in the Indian calendar.",
                color: "#fce7f3",
                accent: "#be185d",
              },
              {
                icon: "✨",
                title: "Zero Mass Production",
                desc: "We deliberately limit quantities. Every collection is intentionally small — so each woman feels she is wearing something truly special.",
                color: "#fff1f4",
                accent: "#9d174d",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{
                  background: item.color, borderRadius: 24, padding: "36px 28px",
                  border: `1px solid ${item.accent}22`,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "default",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = `0 20px 60px ${item.accent}22`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div style={{ fontSize: "2.2rem", marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.15rem", color: "#831843", marginBottom: 12,
                  }}>{item.title}</h3>
                  <p style={{ color: "#9d174d", fontSize: "0.9rem", lineHeight: 1.75 }}>
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. COLLECTION SPOTLIGHT ═══ */}
      <section style={{
        background: "linear-gradient(135deg, #fff1f4, #fce7f3, #fbcfe8)",
        padding: "120px 0",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <p style={{ textTransform: "uppercase", letterSpacing: "0.35em", fontSize: 11, color: "#c9487c", marginBottom: 16 }}>
                Our Heritage Collections
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#831843",
              }}>
                The Finest Threads We Carry
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {[
              {
                label: "Handloom Sarees",
                emoji: "🧶",
                origin: "Chanderi · Maheshwar · Banarasi",
                desc: "Our handloom collection is the soul of Revakalp. Each saree is woven on traditional pit-looms by artisans who have inherited this skill over generations. The Chanderi silks shimmer with a gossamer translucence; the Maheshwari drapes carry the weight of royalty; Banarasi brocades speak the language of zari gold.",
                highlight: "Signature: Reversible Maheshwari border in 22 traditional colours",
                gradient: "linear-gradient(135deg, #831843, #c9487c)",
              },
              {
                label: "Bridal Lehengas",
                emoji: "👰",
                origin: "Handcrafted · Custom Embroidery",
                desc: "A Revakalp lehenga is not just a garment — it is a statement. Every lehenga is hand-selected for embroidery quality, fabric weight, and silhouette perfection. We work with skilled karigar families from Jaipur and Surat to bring opulent, one-of-a-kind bridal ensembles that will be treasured for generations.",
                highlight: "Specialty: Zardozi & Resham embroidery, limited-run pieces",
                gradient: "linear-gradient(135deg, #7a1045, #be185d)",
              },
              {
                label: "Synthetic Sarees",
                emoji: "🌸",
                origin: "Modern Drapes · Festive Ready",
                desc: "For the woman who wants elegance without the weight of heavy silk — our synthetic collection offers vibrant prints, flowy georgettes, and rich chiffons. Perfect for festivals, office events, and daily saree lovers who want beauty with comfort.",
                highlight: "Best for: Navratri, Diwali, corporate occasions",
                gradient: "linear-gradient(135deg, #9d174d, #c9487c)",
              },
              {
                label: "Festive Specials",
                emoji: "🪔",
                origin: "Seasonal · Limited Edition",
                desc: "Twice a year — for wedding season and Diwali — Revakalp drops a limited Festive Edit. These curated capsule collections are inspired by the colours and mood of the season, with exclusive pieces that sell out within days.",
                highlight: "Upcoming: Wedding Season 2026 Edit — dropping soon",
                gradient: "linear-gradient(135deg, #831843, #7a1045)",
              },
            ].map((col, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div style={{
                  background: "#fff", borderRadius: 28, overflow: "hidden",
                  boxShadow: "0 8px 40px rgba(201,72,124,0.12)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 24px 60px rgba(201,72,124,0.25)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "0 8px 40px rgba(201,72,124,0.12)";
                  }}
                >
                  {/* Header */}
                  <div style={{
                    background: col.gradient, padding: "32px 36px",
                    display: "flex", alignItems: "center", gap: 16,
                  }}>
                    <span style={{ fontSize: "2.5rem" }}>{col.emoji}</span>
                    <div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#fff", fontSize: "1.4rem", marginBottom: 4,
                      }}>{col.label}</h3>
                      <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.78rem", letterSpacing: "0.1em" }}>
                        {col.origin}
                      </p>
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ padding: "28px 36px" }}>
                    <p style={{ color: "#9d174d", lineHeight: 1.8, fontSize: "0.92rem", marginBottom: 20 }}>
                      {col.desc}
                    </p>
                    <div style={{
                      background: "#fce7f3", borderRadius: 12, padding: "14px 18px",
                      borderLeft: "3px solid #c9487c",
                    }}>
                      <p style={{ color: "#c9487c", fontSize: "0.82rem", fontWeight: 600 }}>
                        ✦ {col.highlight}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div style={{ textAlign: "center", marginTop: 60 }}>
              <Link to="/shop" style={{
                background: "linear-gradient(135deg, #c9487c, #831843)",
                color: "#fff", padding: "16px 48px", borderRadius: 50,
                textDecoration: "none", fontSize: "0.95rem", fontWeight: 600,
                boxShadow: "0 8px 32px rgba(201,72,124,0.35)",
                display: "inline-block", transition: "transform 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >
                Browse All Collections
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ 6. STATS — THE NUMBERS THAT MATTER ═══ */}
      <section style={{
        background: "linear-gradient(135deg, #1a0010, #3d0030, #7a1045)",
        padding: "100px 0",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff",
              }}>
                Ten Years, Countless Stories
              </h2>
              <p style={{ color: "#fce7f3", marginTop: 12, opacity: 0.8 }}>
                Every number here represents a woman who found her perfect drape.
              </p>
            </div>
          </Reveal>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
          }}>
            {[
              { value: 10, suffix: "+", label: "Years in Business", emoji: "🏆" },
              { value: 10000, suffix: "+", label: "Happy Customers", emoji: "💃" },
              { value: 500, suffix: "+", label: "Curated Designs", emoji: "🧶" },
              { value: 50, suffix: "+", label: "Artisan Families", emoji: "🤝" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(249,168,212,0.2)",
                  borderRadius: 24, padding: "40px 24px",
                  textAlign: "center",
                  transition: "transform 0.3s, background 0.3s",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.background = "rgba(201,72,124,0.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{stat.emoji}</div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "3rem", fontWeight: 700,
                    background: "linear-gradient(135deg, #fbbf24, #f9a8d4)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    lineHeight: 1,
                  }}>
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p style={{ color: "#fce7f3", marginTop: 10, fontSize: "0.85rem", opacity: 0.8 }}>
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. INDORE IDENTITY + CLOSING CTA ═══ */}
      <section style={{ background: "#fff9fb", padding: "120px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", marginBottom: 100 }}>

            <Reveal delay={0.1}>
              <div>
                <p style={{ textTransform: "uppercase", letterSpacing: "0.35em", fontSize: 11, color: "#c9487c", marginBottom: 16 }}>
                  Proudly Indori
                </p>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#831843",
                  lineHeight: 1.2, marginBottom: 28,
                }}>
                  Indore's Best-Kept Fashion Secret
                </h2>
                <p style={{ color: "#9d174d", lineHeight: 1.9, marginBottom: 20, fontSize: "1rem" }}>
                  Indore is a city of pride. Indoris know good food, good music, and most certainly — good fabric. Revakalp grew in this soil. Our sensibility is Indori: direct, warm, with an eye for quality and an instinct for beauty.
                </p>
                <p style={{ color: "#9d174d", lineHeight: 1.9, marginBottom: 20, fontSize: "1rem" }}>
                  Today, our physical store remains open in Indore — a space where women walk in and lose an hour in the folds of Maheshwari silk and the glimmer of zari lehengas. Our online store brings this same experience to every corner of India.
                </p>
                <p style={{ color: "#9d174d", lineHeight: 1.9, fontSize: "1rem" }}>
                   Whether you are a loyal Indore regular or a first-time online visitor from Chennai — you will feel the same warmth, the same care, the same promise: only the best, handpicked, just for you.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div style={{
                background: "linear-gradient(135deg, #fce7f3, #fff1f4)",
                borderRadius: 32, padding: 48,
                border: "1px solid #fbbf2422",
              }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem", color: "#831843", marginBottom: 32,
                }}>Visit Us in Indore</h3>
                {[
                  { icon: "📍", label: "Location", val: "231-231, Shop No.2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012" },
                  { icon: "🕐", label: "Store Hours", val: "Mon–Sat: 10:30 AM – 8:30 PM" },
                  { icon: "📞", label: "Call / WhatsApp", val: "9109676562" },
                  { icon: "📦", label: "Online Orders", val: "Shipped Pan-India, 3–7 days" },
                  { icon: "🎁", label: "Gift Wrapping", val: "Available for all orders" },
                ].map((info, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 16, alignItems: "flex-start",
                    marginBottom: i < 4 ? 24 : 0,
                    paddingBottom: i < 4 ? 24 : 0,
                    borderBottom: i < 4 ? "1px solid #fce7f3" : "none",
                  }}>
                    <span style={{ fontSize: "1.3rem", marginTop: 2 }}>{info.icon}</span>
                    <div>
                      <p style={{ color: "#c9487c", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                        {info.label}
                      </p>
                      <p style={{ color: "#831843", fontSize: "0.95rem" }}>{info.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Closing Quote */}
          <Reveal delay={0.1}>
            <div style={{
              textAlign: "center",
              background: "linear-gradient(135deg, #1a0010, #3d0030)",
              borderRadius: 32, padding: "72px 48px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -60, right: -60,
                width: 200, height: 200, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,72,124,0.3) 0%, transparent 70%)",
              }} />
              <div style={{
                position: "absolute", bottom: -60, left: -60,
                width: 200, height: 200, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)",
              }} />
              <p style={{
                fontSize: "3rem", color: "#f9a8d4", opacity: 0.5,
                fontFamily: "Georgia, serif", lineHeight: 1,
                marginBottom: 8,
              }}>"</p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#fff",
                lineHeight: 1.5, maxWidth: 700, margin: "0 auto",
              }}>
                Choosing Revakalp is choosing to wear a story —
                one woven with ten years of love, miles of travel,
                and the unending belief that every woman deserves to feel like royalty.
              </p>
              <p style={{
                fontSize: "3rem", color: "#f9a8d4", opacity: 0.5,
                fontFamily: "Georgia, serif", lineHeight: 1,
                marginTop: 8,
              }}>"</p>
              <p style={{ color: "#f9a8d4", marginTop: 24, fontSize: "0.9rem", letterSpacing: "0.15em", opacity: 0.8 }}>
                — Anjali Katare, Founder · Revakalp, Indore
              </p>

              <div style={{ marginTop: 48, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/shop" style={{
                  background: "linear-gradient(135deg, #c9487c, #7a1045)",
                  color: "#fff", padding: "15px 40px", borderRadius: 50,
                  textDecoration: "none", fontWeight: 600, fontSize: "0.9rem",
                  boxShadow: "0 8px 30px rgba(201,72,124,0.5)",
                  display: "inline-block", transition: "transform 0.3s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = ""}
                >
                  Shop Now
                </Link>
                <Link to="/contact" style={{
                  border: "1.5px solid rgba(249,168,212,0.5)",
                  color: "#fce7f3", padding: "15px 40px", borderRadius: 50,
                  textDecoration: "none", fontWeight: 500, fontSize: "0.9rem",
                  backdropFilter: "blur(8px)", display: "inline-block",
                  transition: "background 0.3s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterBox />

      {/* ─── Keyframe styles ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(8px); }
        }

        @media (max-width: 900px) {
          .about-grid-2col { grid-template-columns: 1fr !important; }
          .about-timeline-card { width: 80% !important; margin: 0 auto !important; }
          .about-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .about-philosophy-grid { grid-template-columns: 1fr 1fr !important; }
          .about-timeline-dot { display: none !important; }
          .about-timeline-line { display: none !important; }
        }
        @media (max-width: 600px) {
          .about-philosophy-grid { grid-template-columns: 1fr !important; }
          .about-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
