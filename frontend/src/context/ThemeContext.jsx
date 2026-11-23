import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useStore from "../store/store";
import {
  THEME_SCHEMES,
  VALID_SCHEME_IDS,
  ThemeContext,
} from "./themeConfig";

const SCHEME_STORAGE_KEY = "rk-theme-scheme";
const MODE_STORAGE_KEY = "rk-theme-mode";

function readInitialScheme() {
  if (typeof window === "undefined") return null;
  try {
    const domScheme = document.documentElement?.dataset?.theme;
    if (domScheme && VALID_SCHEME_IDS.has(domScheme)) return domScheme;
    const stored = window.localStorage.getItem(SCHEME_STORAGE_KEY);
    if (stored && VALID_SCHEME_IDS.has(stored)) return stored;
  } catch {
    // ignore storage access issues
  }
  return null;
}

function readInitialMode() {
  if (typeof window === "undefined") return "light";
  try {
    const domMode = document.documentElement?.dataset?.mode;
    if (domMode === "dark" || domMode === "light") return domMode;
    const stored = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // ignore storage access issues
  }
  return "light";
}

function buildThemedFaviconDataUrl(primaryHex, accentHex, bgHex) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${primaryHex}"/><rect x="4" y="4" width="56" height="56" rx="11" fill="none" stroke="${accentHex}" stroke-opacity="0.7" stroke-width="2"/><text x="32" y="43" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="34" fill="${bgHex}">R</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function ThemeProvider({ children }) {
  const settingsThemeScheme = useStore((s) => s.settings?.themeScheme);
  const settingsThemeMode = useStore((s) => s.settings?.themeMode);
  const settingsHydrated = useStore((s) => s.settingsHydrated);

  const [scheme, setSchemeState] = useState(readInitialScheme);
  const [mode, setModeState] = useState(readInitialMode);
  const hasPaintedRef = useRef(false);

  const setScheme = useCallback((nextScheme, options = {}) => {
    const { persistCache = true } = options;
    if (!VALID_SCHEME_IDS.has(nextScheme)) return;
    setSchemeState(nextScheme);
    if (persistCache) {
      try {
        window.localStorage.setItem(SCHEME_STORAGE_KEY, nextScheme);
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  const setMode = useCallback((nextMode, options = {}) => {
    const { persistCache = true } = options;
    if (nextMode !== "light" && nextMode !== "dark") return;
    setModeState(nextMode);
    if (persistCache) {
      try {
        window.localStorage.setItem(MODE_STORAGE_KEY, nextMode);
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(MODE_STORAGE_KEY, next);
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const restorePublishedTheme = useCallback(() => {
    const liveSettings = useStore.getState().settings;
    if (liveSettings?.themeScheme && VALID_SCHEME_IDS.has(liveSettings.themeScheme)) {
      setSchemeState(liveSettings.themeScheme);
    }
    if (liveSettings?.themeMode === "light" || liveSettings?.themeMode === "dark") {
      setModeState(liveSettings.themeMode);
    }
  }, []);

  // Only sync from backend once live /api/settings has actually hydrated
  useEffect(() => {
    if (!settingsHydrated) return;
    if (settingsThemeScheme && VALID_SCHEME_IDS.has(settingsThemeScheme)) {
      setSchemeState(settingsThemeScheme);
      try {
        window.localStorage.setItem(SCHEME_STORAGE_KEY, settingsThemeScheme);
      } catch {
        // ignore storage errors
      }
    }
  }, [settingsHydrated, settingsThemeScheme]);

  useEffect(() => {
    if (!settingsHydrated) return;
    if (settingsThemeMode === "light" || settingsThemeMode === "dark") {
      setModeState(settingsThemeMode);
      try {
        window.localStorage.setItem(MODE_STORAGE_KEY, settingsThemeMode);
      } catch {
        // ignore storage errors
      }
    }
  }, [settingsHydrated, settingsThemeMode]);

  const activeSchemeMeta = useMemo(
    () => THEME_SCHEMES.find((s) => s.id === scheme) || null,
    [scheme]
  );

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const root = document.documentElement;
    let raf1 = null;
    let raf2 = null;

    if (!scheme || !VALID_SCHEME_IDS.has(scheme) || !activeSchemeMeta) {
      root.dataset.mode = mode;
      root.style.colorScheme = mode;
      return undefined;
    }

    // Flip all surfaces, ink, borders, and marks atomically in a single paint frame
    if (hasPaintedRef.current) {
      root.classList.add("rk-theme-instant");
    } else {
      hasPaintedRef.current = true;
    }

    delete root.dataset.themePending;
    root.dataset.theme = scheme;
    root.dataset.mode = mode;
    root.style.colorScheme = mode;

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        mode === "dark"
          ? activeSchemeMeta.metaColorDark
          : activeSchemeMeta.metaColorLight
      );
    }

    const svgIconLink = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (svgIconLink) {
      const [primaryHex, accentHex, lightBg] = activeSchemeMeta.swatches || [
        "#141416",
        "#B8A47C",
        "#F6F6F4",
      ];
      svgIconLink.setAttribute(
        "href",
        buildThemedFaviconDataUrl(
          mode === "dark" ? activeSchemeMeta.metaColorDark : primaryHex,
          accentHex,
          mode === "dark" ? accentHex : lightBg
        )
      );
    }

    if (root.classList.contains("rk-theme-instant")) {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          root.classList.remove("rk-theme-instant");
        });
      });
    }

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [scheme, mode, activeSchemeMeta]);

  const value = useMemo(
    () => ({
      scheme,
      mode,
      isDarkMode: mode === "dark",
      activeSchemeMeta,
      publishedScheme: settingsThemeScheme || null,
      publishedMode: settingsThemeMode || null,
      schemes: THEME_SCHEMES,
      setScheme,
      setMode,
      toggleMode,
      restorePublishedTheme,
    }),
    [
      scheme,
      mode,
      activeSchemeMeta,
      settingsThemeScheme,
      settingsThemeMode,
      setScheme,
      setMode,
      toggleMode,
      restorePublishedTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
