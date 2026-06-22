export const CARD_THEMES = [
  "obsidian",
  "graphite",
  "slate",
  "stone",
  "ink",
  "charcoal",
  "onyx",
  "rupay",
] as const;

export type CardTheme = (typeof CARD_THEMES)[number];

const LEGACY_MAP: Record<string, CardTheme> = {
  obsidian: "obsidian",
  graphite: "graphite",
  slate: "slate",
  stone: "stone",
  ink: "ink",
  charcoal: "charcoal",
  onyx: "onyx",
  rupay: "rupay",
  violet: "ink",
  ocean: "slate",
  ember: "stone",
  forest: "graphite",
  aurora: "charcoal",
  midnight: "onyx",
  gold: "stone",
};

export function pickTheme(index: number, brand?: string): CardTheme {
  if (brand === "rupay") return "rupay";
  return CARD_THEMES[index % CARD_THEMES.length];
}

export function resolveTheme(gradient: string): CardTheme {
  if (LEGACY_MAP[gradient]) return LEGACY_MAP[gradient];
  return "obsidian";
}

export function themeClass(theme: CardTheme): string {
  return `card-theme-${theme}`;
}
