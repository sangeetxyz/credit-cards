import type { CSSProperties } from "react";
import type { CreditCard } from "@/lib/types";

export type CardColorInput = Pick<
  CreditCard,
  | "id"
  | "label"
  | "cardholderName"
  | "cardNumber"
  | "expiryMonth"
  | "expiryYear"
  | "brand"
  | "colorSeed"
>;

export type CardColorProfile = {
  signature: string;
  hue: number;
  hueSecondary: number;
  saturation: number;
  style: CSSProperties;
};

/** Stable seed — uses colorSeed when set, otherwise derives from card identity fields. */
export function buildCardColorSeed(card: CardColorInput): string {
  if (card.colorSeed) {
    return card.colorSeed;
  }

  return [
    card.id,
    card.label.trim().toLowerCase(),
    card.cardholderName.trim().toLowerCase(),
    card.cardNumber.replace(/\D/g, ""),
    card.expiryMonth,
    card.expiryYear,
    card.brand,
  ].join("\0");
}

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function channelUnit(seed: string, channel: number): number {
  return fnv1a32(`${seed}\0${channel}`) / 0xffffffff;
}

function between(seed: string, channel: number, min: number, max: number): number {
  return min + channelUnit(seed, channel) * (max - min);
}

function pickInt(seed: string, channel: number, min: number, max: number): number {
  return Math.floor(between(seed, channel, min, max + 1));
}

type PaletteMode = "identity" | "random";

function generatePalette(
  seed: string,
  mode: PaletteMode,
): Omit<CardColorProfile, "signature"> & { signatureSuffix: string } {
  const random = mode === "random";

  const hue = pickInt(seed, 0, 0, 359);
  const hueSpread = random
    ? pickInt(seed, 1, 18, 210)
    : 32 + pickInt(seed, 1, 0, 64);
  const hueSecondary = (hue + hueSpread) % 360;

  const saturation = random
    ? pickInt(seed, 2, 38, 88)
    : 50 + pickInt(seed, 2, 0, 20);
  const saturationSoft = random
    ? pickInt(seed, 3, 22, 76)
    : Math.max(38, saturation - 8 - pickInt(seed, 3, 0, 7));

  const lightness = random
    ? pickInt(seed, 4, 18, 40)
    : 28 + pickInt(seed, 4, 0, 12);
  const lightnessGlow = random
    ? pickInt(seed, 5, lightness + 4, Math.min(58, lightness + 22))
    : lightness + 8 + pickInt(seed, 5, 0, 10);

  const bloomX = random
    ? pickInt(seed, 6, 8, 92)
    : 68 + pickInt(seed, 6, 0, 28);
  const bloomY = random
    ? pickInt(seed, 7, 0, 38)
    : 2 + pickInt(seed, 7, 0, 22);
  const depthX = random
    ? pickInt(seed, 8, 0, 48)
    : 4 + pickInt(seed, 8, 0, 22);
  const depthY = random
    ? pickInt(seed, 9, 55, 98)
    : 78 + pickInt(seed, 9, 0, 18);

  const gradientAngle = random
    ? pickInt(seed, 10, 115, 165)
    : 138;
  const surfaceSatPrimary = random
    ? pickInt(seed, 11, 14, 42)
    : 30;
  const surfaceSatSecondary = random
    ? pickInt(seed, 12, 12, 38)
    : 26;
  const surfaceLightPrimary = random
    ? between(seed, 13, 2.5, 6.5).toFixed(1)
    : "4.5";
  const surfaceLightSecondary = random
    ? between(seed, 14, 4, 8.5).toFixed(1)
    : "5.5";

  const softOpacity = random
    ? between(seed, 15, 0.2, 0.38).toFixed(2)
    : "0.28";
  const faintOpacity = random
    ? between(seed, 16, 0.12, 0.28).toFixed(2)
    : "0.18";
  const bloomOpacity = random
    ? between(seed, 17, 0.14, 0.32).toFixed(2)
    : "0.22";
  const depthOpacity = random
    ? between(seed, 18, 0.1, 0.24).toFixed(2)
    : "0.16";
  const edgeOpacity = random
    ? between(seed, 19, 0.28, 0.48).toFixed(2)
    : "0.36";
  const glowOpacity = random
    ? between(seed, 20, 0.14, 0.32).toFixed(2)
    : "0.22";

  const bloomLightness = random
    ? pickInt(seed, 21, 38, 62)
    : 46;
  const depthLightness = random
    ? pickInt(seed, 22, 26, 44)
    : 34;
  const edgeLightness = random
    ? pickInt(seed, 23, 14, 26)
    : 18;

  const style = {
    "--card-hue-primary": String(hue),
    "--card-hue-secondary": String(hueSecondary),
    "--card-accent": `hsl(${hue} ${saturation}% ${lightness}%)`,
    "--card-accent-secondary": `hsl(${hueSecondary} ${saturationSoft}% ${lightnessGlow}%)`,
    "--card-accent-soft": `hsla(${hue}, ${saturation}%, ${lightnessGlow}%, ${softOpacity})`,
    "--card-accent-faint": `hsla(${hueSecondary}, ${saturationSoft}%, ${lightness}%, ${faintOpacity})`,
    "--card-accent-bloom": `hsla(${hue}, ${saturation}%, ${bloomLightness}%, ${bloomOpacity})`,
    "--card-accent-depth": `hsla(${hueSecondary}, ${saturationSoft}%, ${depthLightness}%, ${depthOpacity})`,
    "--card-accent-edge": `hsla(${hue}, ${Math.round(saturation * 0.55)}%, ${edgeLightness}%, ${edgeOpacity})`,
    "--card-accent-rim": `hsla(${hueSecondary}, ${saturationSoft}%, ${lightnessGlow}%, 0.12)`,
    "--card-accent-shine": `hsla(${hue}, 55%, 52%, 0.1)`,
    "--card-accent-glow": `hsla(${hue}, ${saturation}%, 32%, ${glowOpacity})`,
    "--card-surface-bg": `linear-gradient(${gradientAngle}deg, hsl(${hue} ${surfaceSatPrimary}% ${surfaceLightPrimary}%) 0%, hsl(0 0% 2%) 42%, hsl(${hueSecondary} ${surfaceSatSecondary}% ${surfaceLightSecondary}%) 100%)`,
    "--card-bloom-x": `${bloomX}%`,
    "--card-bloom-y": `${bloomY}%`,
    "--card-depth-x": `${depthX}%`,
    "--card-depth-y": `${depthY}%`,
  } as CSSProperties;

  const signatureSuffix = random
    ? fnv1a32(seed).toString(36)
    : String(saturation);

  return {
    hue,
    hueSecondary,
    saturation,
    style,
    signatureSuffix,
  };
}

export function generateCardColor(card: CardColorInput): CardColorProfile {
  const seed = buildCardColorSeed(card);
  const mode: PaletteMode = card.colorSeed ? "random" : "identity";
  const palette = generatePalette(seed, mode);
  const prefix = mode === "random" ? "r" : "c";

  return {
    hue: palette.hue,
    hueSecondary: palette.hueSecondary,
    saturation: palette.saturation,
    style: palette.style,
    signature: `${prefix}${palette.hue}-${palette.hueSecondary}-s${palette.saturation}-${palette.signatureSuffix}`,
  };
}

export function getCardColorStyle(card: CardColorInput): CSSProperties {
  return generateCardColor(card).style;
}

export function deriveCardColorSignature(card: CardColorInput): string {
  return generateCardColor(card).signature;
}
