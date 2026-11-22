import { getAvailableStock } from "../config/storefrontCategories";

/**
 * Curated historical & regional textile stories for Revakalp's /heritage experience.
 * Grounded in established Indian textile scholarship without fabricating GI tags,
 * workshop ownership, or unverified provenance. Revakalp acts as a curated retail store.
 */
export const HERITAGE_TRADITIONS = [
  {
    slug: "maheshwari",
    index: "01",
    name: "Maheshwari",
    region: "Madhya Pradesh",
    subRegion: "Maheshwar along the Narmada",
    coordinates: "22.1770° N, 75.5880° E",
    tagline: "Airy riverside weaves shaped by Holkar royal grace.",
    summary:
      "Born along the Narmada riverbanks in Maheshwar, Maheshwari sarees are loved for their featherlight cotton-silk drape and neat reversible borders inspired by stone palace forts.",
    catalogSlugs: ["maheshwari"],
    shopRoute: "/shop/saree/maheshwari",
    shaderPreset: "maheshwari",
    paletteSwatches: ["#38131E", "#D4AF63", "#F1D889"],
    map: {
      x: 245,
      y: 315,
      zoomViewBox: "95 215 300 220",
      labelAlign: "right",
    },
    editorial: {
      history:
        "In the late 18th century, Rani Ahilyabai Holkar encouraged fine weaving in the riverside town of Maheshwar. Her vision gave Malwa a distinctive saree language — light enough for Central Indian summers, yet refined enough for royal courts.",
      regionalOrigins:
        "Maheshwar sits beside the broad, stone-lined ghats of the Narmada River, less than two hours from our Indore shop. For generations, the forts, ripples of the water, and Malwa colors shaped how these borders were patterned.",
      materialCharacteristics:
        "Most classic Maheshwari sarees pair a crisp cotton weft with a soft silk warp. That simple blend makes them breathe comfortably through long celebrations while holding crisp, neat pleats all day.",
      craftsmanship:
        "You can recognize a Maheshwari piece by its reversible border (known locally as bugdi) that looks just as tidy from either side, paired with striped pallus and quiet checks or tissue shimmer.",
      culturalSignificance:
        "Across Madhya Pradesh and beyond, a Maheshwari saree is often the first choice for morning pujas, family gatherings, and daytime weddings — understated, comfortable, and timeless.",
    },
    motifs: [
      {
        id: "narmada-wave",
        name: "Leher (River Wave)",
        description:
          "Gentle zigzag stripes echoing the ripples of the Narmada River below Maheshwar Fort.",
        svgKind: "wave",
      },
      {
        id: "chatai",
        name: "Chatai (Reed Mat Check)",
        description:
          "Small, crisp woven checks along the border inspired by interlaced reed mats.",
        svgKind: "lattice",
      },
      {
        id: "chameli",
        name: "Chameli Flower",
        description:
          "Fine diamond-like jasmine buds arranged delicately down narrow metallic borders.",
        svgKind: "floral",
      },
    ],
    careGuidance: [
      "Dry-clean silk and cotton-silk Maheshwari sarees, especially darker shades or pieces with zari stripes.",
      "Wrap your folded saree in soft, breathable cotton cloth rather than plastic covers.",
      "Refold along slightly different lines every few months so the zari edges stay relaxed.",
      "Iron lightly on the reverse side with a thin cotton pressing cloth over the border.",
    ],
  },
  {
    slug: "kosa-silk",
    index: "02",
    name: "Kosa Silk",
    region: "Chhattisgarh",
    subRegion: "Champa, Korba & Raigarh",
    coordinates: "22.0360° N, 82.6510° E",
    tagline: "Warm honey-gold wild silk with a quiet, natural texture.",
    summary:
      "Drawn from wild tussar cocoons in the forests of Chhattisgarh, Kosa silk carries a warm golden-beige glow and an organic slub texture that feels effortlessly poised.",
    catalogSlugs: ["kosa", "tussar"],
    shopRoute: "/shop/saree/kosa",
    shaderPreset: "kosa-silk",
    paletteSwatches: ["#C59A4B", "#52321E", "#F7F1E5"],
    map: {
      x: 348,
      y: 325,
      zoomViewBox: "195 225 300 220",
      labelAlign: "right",
    },
    editorial: {
      history:
        "Wild silk has been woven across eastern Central India for centuries, with families in Champa, Korba, and Raigarh turning sturdy forest cocoons into treasured festive drapes.",
      regionalOrigins:
        "Kosa silk is closely tied to Chhattisgarh's Sal and Arjun forests, where wild tussar silkworms thrive naturally, giving the yarn a character distinct from glossy mulberry silk.",
      materialCharacteristics:
        "Even before any dye touches it, Kosa has a warm champagne and honey cast with gentle linear slubs along the thread. It wears cool against the skin and drapes cleanly without clinging.",
      craftsmanship:
        "Because the yarn is slightly crisp and textured, classic Kosa sarees often let the fabric speak first — framed with solid contrasting borders, temple teeth, or deep hand-dyed shades.",
      culturalSignificance:
        "Loved by women who prefer warmth and quiet confidence over heavy sparkle, Kosa fits easily into formal evenings, cultural events, and daytime weddings.",
    },
    motifs: [
      {
        id: "slub-grain",
        name: "Natural Thread Slub",
        description:
          "Soft horizontal variations in the wild silk thread that catch light subtly across plain weaves.",
        svgKind: "grain",
      },
      {
        id: "kumbha",
        name: "Temple Border",
        description:
          "Crisp pointed triangle motifs along the border, anchoring warm fawn and dyed grounds.",
        svgKind: "temple",
      },
      {
        id: "tribal-geometry",
        name: "Woven Pallu Bands",
        description:
          "Simple, striking bands across the pallu highlighting contrast between natural gold and rich borders.",
        svgKind: "stripes",
      },
    ],
    careGuidance: [
      "Always dry-clean Kosa silk to protect its natural luster and slightly crisp drape.",
      "Avoid wringing or rubbing water spots — let the fabric air dry flat away from sun.",
      "Keep perfume and hairspray away from undyed natural silk fibers.",
      "Store neatly folded inside a soft muslin or old cotton saree wrap.",
    ],
  },
  {
    slug: "bandhani-leheriya",
    index: "03",
    name: "Bandhani & Leheriya",
    region: "Rajasthan & Gujarat",
    subRegion: "Kutch, Jamnagar, Jaipur & Jodhpur",
    coordinates: "26.9124° N, 70.9000° E",
    tagline: "Tiny tied dots and diagonal monsoon waves bursting with color.",
    summary:
      "Practised from Kutch and Jamnagar to Jodhpur and Jaipur, Bandhani and Leheriya use tiny hand-tied knots before dyeing to create sparkling dot constellations and rolling wave patterns.",
    catalogSlugs: ["bandhej", "bandhani", "leheriya"],
    shopRoute: "/shop/saree/bandhej",
    shaderPreset: "bandhani-leheriya",
    paletteSwatches: ["#5B1429", "#D4AF63", "#EFE6D5"],
    map: {
      x: 155,
      y: 262,
      zoomViewBox: "40 160 280 220",
      labelAlign: "left",
    },
    editorial: {
      history:
        "Tie-resist dyeing has been worn in India for over a thousand years, with early dotted garments appearing even in ancient Ajanta cave paintings. Over time, guilds in Gujarat and Rajasthan turned simple knots into intricate visual storytelling.",
      regionalOrigins:
        "Kutch and Jamnagar in Gujarat became home to ultra-fine dotted Bandhani on pure silk and georgette, while Jaipur and Jodhpur in Rajasthan became synonymous with joyful monsoon Leheriya stripes.",
      materialCharacteristics:
        "Light, flowing fabrics like pure gajji silk, georgette, chinon, and soft mulmul cotton are ideal because dye flows cleanly around each tiny tied knot.",
      craftsmanship:
        "Before dyeing, hundreds or thousands of pinpoint buds are pinched and bound tightly with cotton thread. For Leheriya, the cloth is rolled diagonally and tied at measured gaps before dipping into successive dye baths.",
      culturalSignificance:
        "Wearing fresh Bandhani or Leheriya marks joy and celebration — seen everywhere during Teej, Shravan, mehendi mornings, and family weddings.",
    },
    motifs: [
      {
        id: "ekdali-chaubasi",
        name: "Ekdali & Chaubasi Dots",
        description:
          "Single pinpoints and four-dot diamonds scattered like starry constellations across deep color.",
        svgKind: "dots",
      },
      {
        id: "leheriya-wave",
        name: "Monsoon Wave Stripes",
        description:
          "Diagonal resist stripes flowing across the fabric like wind and rain over desert dunes.",
        svgKind: "wave",
      },
      {
        id: "shikari",
        name: "Clustered Medallions",
        description:
          "Groups of tiny knots arranged to bloom into circular floral patterns and festive borders.",
        svgKind: "medallion",
      },
    ],
    careGuidance: [
      "Always dry-clean knotted Bandhani and Leheriya pieces so colors stay vivid and crinkles stay balanced.",
      "Go easy with the iron if your saree still has soft Bandhani dimples — light steam from a distance works best.",
      "Wrap dark jewel-toned pieces separately in cotton so rich dyes don't mark lighter clothes.",
      "Keep storage cupboards dry during monsoon season.",
    ],
  },
  {
    slug: "kanjivaram",
    index: "04",
    name: "Kanjivaram",
    region: "Tamil Nadu",
    subRegion: "Kanchipuram",
    coordinates: "12.8342° N, 79.7036° E",
    tagline: "Lush mulberry silk with sculptural borders built to last for generations.",
    summary:
      "From Kanchipuram in Tamil Nadu, Kanjivaram sarees are famous for heavy, lustrous mulberry silk, rich contrast borders joined smoothly to the body, and classic temple motifs.",
    catalogSlugs: ["kanjivaram", "kanchipuram"],
    shopRoute: "/shop/saree/kanjivaram",
    shaderPreset: "kanjivaram",
    paletteSwatches: ["#38131E", "#D4AF63", "#2B0E17"],
    map: {
      x: 278,
      y: 545,
      zoomViewBox: "130 410 300 220",
      labelAlign: "right",
    },
    editorial: {
      history:
        "Born in the ancient temple city of Kanchipuram, this silk tradition grew closely alongside South India's stone temple culture — producing heavy, luminous drapes made for lifelong wear.",
      regionalOrigins:
        "Kanchipuram in northern Tamil Nadu has long been home to silk weaving families who combined strong multi-strand mulberry yarn with rich golden borders.",
      materialCharacteristics:
        "Substantial and richly glossy, classic Kanjivaram silk holds dramatic structural pleats while glowing softly under evening lights.",
      craftsmanship:
        "Many contrast-border Kanjivarams are known for strong three-shuttle joins (called korvai) where two separate colors for the body and border are interlocked securely as the saree takes shape.",
      culturalSignificance:
        "From weddings in Chennai to wedding trousseaus in Indore, a Kanjivaram remains one of the most cherished heirloom silhouettes in Indian wardrobes.",
    },
    motifs: [
      {
        id: "gopuram",
        name: "Temple Spires",
        description:
          "Stepped triangular peaks along the border echoing South Indian temple towers.",
        svgKind: "temple",
      },
      {
        id: "annapakshi",
        name: "Sacred Borders & Checks",
        description:
          "Rich traditional border bands paired with rhythmic bead lines and checks.",
        svgKind: "lattice",
      },
      {
        id: "vanki",
        name: "Needle Stripes",
        description:
          "Fine lines and woven checks running cleanly through saturated mulberry fields.",
        svgKind: "stripes",
      },
    ],
    careGuidance: [
      "Only dry-clean Kanjivaram silk every few wears; never soak or wash at home.",
      "Store wrapped in clean, soft cotton cloth — avoid plastic sleeves or wire coat hangers.",
      "Unfold and refold along different creases every 3–4 months so zari folds stay smooth.",
      "Press gently through a dry cotton cloth without direct steam.",
    ],
  },
  {
    slug: "paithani",
    index: "05",
    name: "Paithani",
    region: "Maharashtra",
    subRegion: "Paithan & Yeola",
    coordinates: "19.4750° N, 75.3830° E",
    tagline: "Jewel-toned Deccan silk where peacocks and lotuses shine clearly from both sides.",
    summary:
      "Associated with Paithan and Yeola in Maharashtra, Paithani sarees use tapestry-like weft interlocking so every peacock, lotus, and vine motif appears clean on front and back.",
    catalogSlugs: ["paithani"],
    shopRoute: "/shop/saree/paithani",
    shaderPreset: "paithani",
    paletteSwatches: ["#4E1630", "#D4AF63", "#F1D889"],
    map: {
      x: 215,
      y: 392,
      zoomViewBox: "80 285 290 220",
      labelAlign: "left",
    },
    editorial: {
      history:
        "Taking its name from the historic town of Paithan near the Godavari River and flourishing later in Yeola during the Maratha era, Paithani grew famous for shimmering silk and poetic pictorial borders.",
      regionalOrigins:
        "Both Paithan (near Aurangabad) and Yeola (in Nashik district) shaped Maharashtra's iconic festive silk aesthetic — rich magentas, peacock blues, plums, and shimmering gold pallus.",
      materialCharacteristics:
        "Smooth twisted silk gives Paithani an almost liquid metallic glow across the pallu without feeling stiff or heavy on the shoulder.",
      craftsmanship:
        "Traditional Paithani patterning works much like fine tapestry — tiny colored thread bobbins interlock directly around warp threads, leaving zero loose dangling floats on the underside.",
      culturalSignificance:
        "Treasured at Maharashtrian weddings and passed tenderly across generations, a Paithani turns every festive entrance into a quiet celebration.",
    },
    motifs: [
      {
        id: "bangadi-mor",
        name: "Peacock & Bangle",
        description:
          "Four poised peacocks inside a delicate circular frame across a golden pallu.",
        svgKind: "medallion",
      },
      {
        id: "narali-border",
        name: "Slanted Border Grid",
        description:
          "Crisp oblique squares edging wide luminous borders along the drape.",
        svgKind: "lattice",
      },
      {
        id: "kamal-butti",
        name: "Lotus & Trailing Vine",
        description:
          "Blossoming lotus buds and twisting garden vines illuminating the pallu.",
        svgKind: "floral",
      },
    ],
    careGuidance: [
      "Entrust Paithani drapes only to trusted silk dry cleaners.",
      "Pad the folded pallu lightly with soft acid-free tissue or clean cotton cloth.",
      "Watch out for sharp bangles or brooch pins near delicate tapestry threads.",
      "Keep inside breathable cotton bags away from mothballs.",
    ],
  },
  {
    slug: "pashmina",
    index: "06",
    name: "Pashmina",
    region: "Kashmir",
    subRegion: "Kashmir Valley & Srinagar",
    coordinates: "34.0837° N, 74.7973° E",
    tagline: "Featherlight Himalayan warmth made for quiet winter celebrations.",
    summary:
      "Drawn from soft high-altitude mountain fleece and shaped through Kashmir's centuries-old shawl and winter saree heritage, Pashmina feels cloud-soft while keeping winter chills away.",
    catalogSlugs: ["pashmina", "kashmiri"],
    shopRoute: "/shop/saree/pashmina",
    shaderPreset: "pashmina",
    paletteSwatches: ["#F7F1E5", "#C7A770", "#38131E"],
    map: {
      x: 208,
      y: 112,
      zoomViewBox: "70 15 280 220",
      labelAlign: "right",
    },
    editorial: {
      history:
        "For centuries, fine Himalayan underfleece ('pashm') made its way to the Kashmir Valley, where artisans refined it into soft shawls and winter drapes sought after across India and beyond.",
      regionalOrigins:
        "Rooted in the cold high plateaus of Ladakh and finished within Srinagar and the Kashmir Valley, it brings mountain warmth to winter festive dressing.",
      materialCharacteristics:
        "Remarkably light in your hand yet warm against the skin, Pashmina weaves settle softly without stiff bulk — ideal for outdoor winter receptions and evening gatherings.",
      craftsmanship:
        "Kashmiri winter textiles span understated solids, warm tonal weaves, and delicate embroidered or woven border accents inspired by valley flora.",
      culturalSignificance:
        "Whenever the winter wedding season arrives across North and Central India, a Pashmina drape or winter saree offers rare comfort without losing a trace of grace.",
    },
    motifs: [
      {
        id: "twill-grain",
        name: "Soft Diagonal Twill",
        description:
          "Fine herringbone and diagonal weaves that trap warmth gently while keeping the cloth light.",
        svgKind: "grain",
      },
      {
        id: "badam-paisley",
        name: "Badam & Paisley",
        description:
          "Graceful curved almond and leaf shapes framing winter borders and corners.",
        svgKind: "floral",
      },
      {
        id: "hashiya",
        name: "Framed Perimeter Band",
        description:
          "Tidy border framing along ivory, sandstone, and burgundy fields.",
        svgKind: "stripes",
      },
    ],
    careGuidance: [
      "Dry-clean fine Pashmina garments gently; avoid harsh soaps or warm water.",
      "Store folded flat rather than hanging so the soft fibers never stretch.",
      "Wrap securely in breathable cotton with mild cedar between winter seasons.",
      "Air lightly or steam from a distance instead of pressing with a hot iron.",
    ],
  },
];

export function getTraditionBySlug(slug = "") {
  const normalized = String(slug).trim().toLowerCase();
  return HERITAGE_TRADITIONS.find(
    (t) => t.slug === normalized || t.catalogSlugs.includes(normalized)
  );
}

export function matchTraditionProducts(products = [], tradition) {
  if (!tradition || !Array.isArray(products)) return [];
  const needles = [tradition.name, ...tradition.catalogSlugs]
    .filter(Boolean)
    .map((s) => s.toLowerCase());

  return products.filter((product) => {
    if (getAvailableStock(product) <= 0) return false;
    const hay = [
      product.name,
      product.type,
      product.subCategory,
      product.category,
      product.print,
      product.state,
      product.description,
      product.specs?.weave,
      product.specs?.provenance,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return needles.some((needle) => hay.includes(needle));
  });
}

export function findTraditionForProduct(product) {
  if (!product) return null;
  const hay = [
    product.name,
    product.type,
    product.subCategory,
    product.print,
    product.state,
    product.specs?.weave,
    product.specs?.provenance,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    HERITAGE_TRADITIONS.find((trad) =>
      [trad.name, ...trad.catalogSlugs].some((needle) =>
        hay.includes(needle.toLowerCase())
      )
    ) || null
  );
}
