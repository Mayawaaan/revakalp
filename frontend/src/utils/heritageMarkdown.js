import { getMapStateByTraditionSlug } from "../data/indiaMapPaths";

/**
 * Vite eager raw Markdown imports for all Indian state textile dossiers.
 * Each .md file under src/content/heritage/states/ defines rich YAML frontmatter
 * plus structured 6-chapter editorial sections.
 */
const RAW_STATE_DOSSIERS = import.meta.glob(
  "../content/heritage/states/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
);

function parseScalar(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(block) {
  const meta = {};
  const lines = block.split(/\r?\n/);
  let currentListKey = null;
  let currentItem = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "  ");
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Nested list item inside motifs:
    if (currentListKey && /^\s*-\s+/.test(line)) {
      const rest = line.replace(/^\s*-\s+/, "");
      const colonIdx = rest.indexOf(":");
      currentItem = {};
      if (colonIdx > 0) {
        const k = rest.slice(0, colonIdx).trim();
        const v = rest.slice(colonIdx + 1);
        currentItem[k] = parseScalar(v);
      }
      meta[currentListKey].push(currentItem);
      continue;
    }

    if (currentListKey && currentItem && /^\s{2,}[a-zA-Z0-9_]+\s*:/.test(line)) {
      const colonIdx = trimmed.indexOf(":");
      const k = trimmed.slice(0, colonIdx).trim();
      const v = trimmed.slice(colonIdx + 1);
      currentItem[k] = parseScalar(v);
      continue;
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx <= 0) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    const rawVal = trimmed.slice(colonIdx + 1).trim();

    if (!rawVal) {
      meta[key] = [];
      currentListKey = key;
      currentItem = null;
    } else {
      currentListKey = null;
      currentItem = null;
      meta[key] = parseScalar(rawVal);
    }
  }

  return meta;
}

function slugifyHeading(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseMarkdownSections(body) {
  const sections = [];
  const lines = String(body || "").split(/\r?\n/);
  let current = null;
  let paragraphBuf = [];

  const flushParagraph = () => {
    if (!current || paragraphBuf.length === 0) return;
    const text = paragraphBuf.join(" ").trim();
    if (text) current.paragraphs.push(text);
    paragraphBuf = [];
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      const title = trimmed.slice(3).trim();
      current = {
        id: slugifyHeading(title),
        title,
        paragraphs: [],
        bullets: [],
      };
      sections.push(current);
      continue;
    }

    if (!current) continue;

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph();
      current.bullets.push(trimmed.slice(2).trim());
      continue;
    }

    paragraphBuf.push(trimmed);
  }
  flushParagraph();

  return sections;
}

function stripInlineMarkdown(text) {
  return String(text || "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

export function parseHeritageMarkdown(rawContent, filePath = "") {
  const text = String(rawContent || "");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const frontmatterBlock = match ? match[1] : "";
  const markdownBody = match ? match[2] : text;

  const meta = parseFrontmatter(frontmatterBlock);
  const sections = parseMarkdownSections(markdownBody);

  const findSectionText = (keyword) => {
    const sec = sections.find((s) =>
      s.title.toLowerCase().includes(keyword.toLowerCase())
    );
    return sec ? stripInlineMarkdown(sec.paragraphs.join(" ")) : "";
  };

  const careSection = sections.find((s) =>
    s.title.toLowerCase().includes("care")
  );
  const careGuidance =
    careSection && careSection.bullets.length > 0
      ? careSection.bullets.map(stripInlineMarkdown)
      : [];

  const mapState = getMapStateByTraditionSlug(meta.slug);
  const fallbackCoord = {
    x: mapState?.cx ?? 280,
    y: mapState?.cy ?? 410,
    zoomViewBox: mapState?.zoomViewBox ?? "120 260 320 280",
    labelAlign: mapState?.labelAlign ?? "right",
  };

  const fileName = filePath.split("/").pop() || `${meta.slug}.md`;

  return {
    slug: meta.slug,
    index: String(meta.index || "99").padStart(2, "0"),
    state: meta.state || meta.region,
    mapStateName: meta.mapStateName || meta.state || meta.region,
    zone: meta.zone || "India",
    name: meta.name,
    sareeTitle: meta.sareeTitle || meta.name,
    region: meta.region || meta.state,
    subRegion: meta.subRegion || meta.state,
    coordinates: meta.coordinates || "",
    tagline: meta.tagline || "",
    summary: meta.summary || "",
    catalogSlugs: Array.isArray(meta.catalogSlugs) ? meta.catalogSlugs : [],
    shopRoute: meta.shopRoute || "/shop/saree/saree",
    shaderPreset: meta.shaderPreset || "maheshwari",
    paletteSwatches: Array.isArray(meta.paletteSwatches)
      ? meta.paletteSwatches
      : ["#38131E", "#D4AF63", "#F1D889"],
    weaveStructure: meta.weaveStructure || "Handloom Weave",
    warpFiber: meta.warpFiber || "Natural Handloom Fiber",
    weftFiber: meta.weftFiber || "Fine Handloom Weft",
    loomType: meta.loomType || "Traditional Handloom",
    featured: Boolean(meta.featured),
    motifs: Array.isArray(meta.motifs) ? meta.motifs : [],
    map: fallbackCoord,
    editorial: {
      history: findSectionText("history"),
      regionalOrigins: findSectionText("regional"),
      materialCharacteristics: findSectionText("material"),
      craftsmanship: findSectionText("craftsmanship"),
      culturalSignificance: findSectionText("cultural"),
    },
    careGuidance,
    sections,
    sourceFile: `src/content/heritage/states/${fileName}`,
  };
}

export function loadAllHeritageTraditions() {
  const entries = Object.entries(RAW_STATE_DOSSIERS).map(([filePath, raw]) =>
    parseHeritageMarkdown(raw, filePath)
  );
  return entries.sort((a, b) => a.index.localeCompare(b.index));
}

/**
 * Splits a markdown paragraph into bold/italic segments for safe React rendering
 * without dangerouslySetInnerHTML.
 */
export function tokenizeInlineMarkdown(text) {
  const input = String(text || "");
  const tokens = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIdx = 0;
  let m;

  while ((m = pattern.exec(input)) !== null) {
    if (m.index > lastIdx) {
      tokens.push({ type: "text", value: input.slice(lastIdx, m.index) });
    }
    const raw = m[0];
    if (raw.startsWith("**")) {
      tokens.push({ type: "bold", value: raw.slice(2, -2) });
    } else {
      tokens.push({ type: "italic", value: raw.slice(1, -1) });
    }
    lastIdx = pattern.lastIndex;
  }

  if (lastIdx < input.length) {
    tokens.push({ type: "text", value: input.slice(lastIdx) });
  }

  return tokens;
}
