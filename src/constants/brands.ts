/**
 * Known subscription services: the tile colour from the design, plus a
 * one-colour logo from assets/icons where we have one. Services without a
 * logo show their first letter on the coloured tile instead.
 */
import type { ImageSourcePropType } from "react-native";

export type Brand = {
  name: string;
  color: string;
  logo?: ImageSourcePropType;
};

export const brands = {
  adobe: { name: "Adobe", color: "#fa0f00", logo: require("@/assets/icons/adobe.png") },
  appleMusic: { name: "Apple Music", color: "#fa2d48" },
  canva: { name: "Canva", color: "#00c4cc", logo: require("@/assets/icons/canva.png") },
  chatgpt: { name: "ChatGPT", color: "#10a37f", logo: require("@/assets/icons/openai.png") },
  claude: { name: "Claude", color: "#d97757", logo: require("@/assets/icons/claude.png") },
  disneyPlus: { name: "Disney+", color: "#113ccf" },
  dropbox: { name: "Dropbox", color: "#0061ff", logo: require("@/assets/icons/dropbox.png") },
  dstv: { name: "DStv", color: "#0b5ed7" },
  duolingo: { name: "Duolingo", color: "#58cc02" },
  figma: { name: "Figma", color: "#f24e1e", logo: require("@/assets/icons/figma.png") },
  github: { name: "GitHub Copilot", color: "#24292f", logo: require("@/assets/icons/github.png") },
  icloud: { name: "iCloud+", color: "#3693f3" },
  medium: { name: "Medium", color: "#000000", logo: require("@/assets/icons/medium.png") },
  netflix: { name: "Netflix", color: "#e50914", logo: require("@/assets/icons/netflix.png") },
  notion: { name: "Notion", color: "#ffffff", logo: require("@/assets/icons/notion.png") },
  primeVideo: { name: "Prime Video", color: "#00a8e1" },
  showmax: { name: "Showmax", color: "#5b2be0" },
  spotify: { name: "Spotify", color: "#1db954", logo: require("@/assets/icons/spotify.png") },
  youtube: { name: "YouTube Premium", color: "#ff0000" },
} satisfies Record<string, Brand>;

export type BrandId = keyof typeof brands;

/** The "Popular" grid on the Add subscription screen, in the design's order. */
export const popularBrands: BrandId[] = [
  "netflix",
  "spotify",
  "youtube",
  "showmax",
  "dstv",
  "appleMusic",
  "disneyPlus",
  "primeVideo",
  "canva",
  "chatgpt",
  "icloud",
  "duolingo",
];
