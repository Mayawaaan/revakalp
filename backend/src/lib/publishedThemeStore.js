import fs from "fs";
import path from "path";
import { VALID_THEME_SCHEMES } from "../models/settings.model.js";

const VALID_SCHEMES_SET = new Set(VALID_THEME_SCHEMES);
const VALID_MODES_SET = new Set(["light", "dark"]);
const CACHE_DIR = path.resolve("data");
const CACHE_FILE = path.join(CACHE_DIR, "published-theme.json");

let memoryTheme = null;

function sanitizeThemePayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  const { themeScheme, themeMode } = payload;
  if (!VALID_SCHEMES_SET.has(themeScheme)) return null;
  const safeMode = VALID_MODES_SET.has(themeMode) ? themeMode : "light";
  return {
    themeScheme,
    themeMode: safeMode,
    updatedAt: payload.updatedAt || new Date().toISOString(),
  };
}

export function readPublishedTheme() {
  if (memoryTheme && VALID_SCHEMES_SET.has(memoryTheme.themeScheme)) {
    return memoryTheme;
  }

  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, "utf8");
    const parsed = sanitizeThemePayload(JSON.parse(raw));
    if (parsed) {
      memoryTheme = parsed;
      return parsed;
    }
  } catch {
    // Ignore corrupt or unreadable cache files
  }

  return null;
}

export function writePublishedTheme({ themeScheme, themeMode }) {
  const sanitized = sanitizeThemePayload({
    themeScheme,
    themeMode,
    updatedAt: new Date().toISOString(),
  });
  if (!sanitized) return null;

  memoryTheme = sanitized;

  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const tmpFile = `${CACHE_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(sanitized, null, 2), "utf8");
    fs.renameSync(tmpFile, CACHE_FILE);
  } catch {
    // Keep memory cache even if filesystem write fails
  }

  return sanitized;
}
