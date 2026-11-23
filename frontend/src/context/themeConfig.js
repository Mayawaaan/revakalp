import { createContext, useContext } from "react";

export const THEME_SCHEMES = [
  {
    id: "royal-burgundy",
    name: "Royal Burgundy",
    shortName: "Burgundy",
    mood: "Regal",
    tagline: "Deep Wine Burgundy & Antique Gold",
    swatches: ["#38131E", "#D4AF63", "#F7F1E5"],
    metaColorLight: "#38131E",
    metaColorDark: "#13080C",
  },
  {
    id: "emerald-banaras",
    name: "Emerald Banaras",
    shortName: "Emerald",
    mood: "Heritage",
    tagline: "Ganga Silk Emerald & Burnished Gold",
    swatches: ["#0F3B2E", "#CFA653", "#F3F5EE"],
    metaColorLight: "#0F3B2E",
    metaColorDark: "#081310",
  },
  {
    id: "indigo-jaipur",
    name: "Indigo Jaipur",
    shortName: "Indigo",
    mood: "Royal",
    tagline: "Royal Neel Indigo & Marigold Brass",
    swatches: ["#1B2948", "#D3A34E", "#F4F2EC"],
    metaColorLight: "#1B2948",
    metaColorDark: "#0A0F1A",
  },
  {
    id: "saffron-udaipur",
    name: "Saffron Udaipur",
    shortName: "Udaipur",
    mood: "Festive",
    tagline: "Terracotta Sindoor & Sandstone Ivory",
    swatches: ["#7C2D12", "#D99226", "#FAF3E8"],
    metaColorLight: "#7C2D12",
    metaColorDark: "#160B07",
  },
  {
    id: "peacock-kanchipuram",
    name: "Peacock Kanchipuram",
    shortName: "Mayura",
    mood: "Couture",
    tagline: "Temple Teal & Zari Copper-Gold",
    swatches: ["#0D444D", "#C89643", "#EFF5F4"],
    metaColorLight: "#0D444D",
    metaColorDark: "#071316",
  },
  {
    id: "jamuni-mysore",
    name: "Jamuni Mysore",
    shortName: "Jamuni",
    mood: "Imperial",
    tagline: "Imperial Aubergine Silk & Champagne Zari",
    swatches: ["#3D1946", "#CFA158", "#F6F1F6"],
    metaColorLight: "#3D1946",
    metaColorDark: "#120916",
  },
  {
    id: "rose-chanderi",
    name: "Rose Chanderi",
    shortName: "Rose",
    mood: "Bridal",
    tagline: "Heirloom Gulabi Rosewood & Rose Gold",
    swatches: ["#6B2238", "#C98F6B", "#FAF1F2"],
    metaColorLight: "#6B2238",
    metaColorDark: "#160A0E",
  },
  {
    id: "sandalwood-maheshwar",
    name: "Sandalwood Maheshwar",
    shortName: "Maheshwar",
    mood: "Handloom",
    tagline: "Narmada Teak, Brass & Tussar Linen",
    swatches: ["#4A2F1D", "#C49545", "#F5EFE6"],
    metaColorLight: "#4A2F1D",
    metaColorDark: "#130E09",
  },
  {
    id: "obsidian-kashi",
    name: "Obsidian Kashi",
    shortName: "Obsidian",
    mood: "Editorial",
    tagline: "Charcoal Obsidian Silk & Champagne Gold",
    swatches: ["#1C1C1F", "#C7A763", "#F4F3F0"],
    metaColorLight: "#1C1C1F",
    metaColorDark: "#0B0B0D",
  },
];

export const VALID_SCHEME_IDS = new Set(THEME_SCHEMES.map((s) => s.id));

export const ThemeContext = createContext({
  scheme: null,
  mode: "light",
  isDarkMode: false,
  activeSchemeMeta: null,
  publishedScheme: null,
  publishedMode: null,
  schemes: THEME_SCHEMES,
  setScheme: () => {},
  setMode: () => {},
  toggleMode: () => {},
  restorePublishedTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}
