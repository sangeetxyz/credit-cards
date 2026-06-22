import { pickTheme } from "./card-themes";
import type { CardBrand, CardFormData } from "./types";

export type { CardTheme } from "./card-themes";
export { pickTheme, resolveTheme, themeClass } from "./card-themes";

export function detectBrand(number: string): CardBrand {
  const n = number.replace(/\D/g, "");
  if (!n) return "unknown";

  if (n.startsWith("508")) return "rupay";
  if (/^60[678]/.test(n)) return "rupay";
  if (n.startsWith("6521") || n.startsWith("6522")) return "rupay";
  if (n.startsWith("653")) return "rupay";
  if (n.startsWith("81") || n.startsWith("82")) return "rupay";
  if (n.startsWith("353") || n.startsWith("356")) return "rupay";

  if (n.startsWith("34") || n.startsWith("37")) return "amex";
  if (n.startsWith("4")) return "visa";

  const firstTwo = Number.parseInt(n.slice(0, 2), 10);
  if (firstTwo >= 51 && firstTwo <= 55) return "mastercard";
  if (n.length >= 4) {
    const firstFour = Number.parseInt(n.slice(0, 4), 10);
    if (firstFour >= 2221 && firstFour <= 2720) return "mastercard";
  }

  if (n.startsWith("6011")) return "discover";
  if (/^64[4-9]/.test(n)) return "discover";
  if (
    n.startsWith("65") &&
    !n.startsWith("6521") &&
    !n.startsWith("6522") &&
    !n.startsWith("653")
  ) {
    return "discover";
  }

  return "unknown";
}

export function formatCardNumber(number: string): string {
  const digits = number.replace(/\D/g, "");
  const brand = detectBrand(digits);
  if (brand === "amex") {
    return digits
      .replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" "),
      )
      .trim();
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function maskCardNumber(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 4) return digits;
  const last4 = digits.slice(-4);
  const brand = detectBrand(digits);
  if (brand === "amex") {
    return `•••• •••••• •${last4}`;
  }
  return `•••• •••• •••• ${last4}`;
}

export function pickGradient(index: number, brand?: CardBrand): string {
  return pickTheme(index, brand);
}

export function luhnCheck(number: string): boolean {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number.parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function expectedLengthsForBrand(brand: CardBrand): number[] {
  switch (brand) {
    case "amex":
      return [15];
    case "visa":
      return [13, 16, 19];
    case "mastercard":
    case "discover":
    case "rupay":
      return [16];
    default:
      return [13, 14, 15, 16, 17, 18, 19];
  }
}

export type CardNumberValidation =
  | { status: "empty" }
  | { status: "incomplete" }
  | { status: "invalid"; message: string }
  | { status: "valid" };

export function validateCardNumber(number: string): CardNumberValidation {
  const digits = number.replace(/\D/g, "");
  if (!digits) return { status: "empty" };

  const brand = detectBrand(digits);
  const expected = expectedLengthsForBrand(brand);
  const minLen = Math.min(...expected);
  const maxLen = Math.max(...expected);

  if (digits.length > maxLen) {
    return { status: "invalid", message: "Card number is too long" };
  }

  if (expected.includes(digits.length)) {
    return luhnCheck(digits)
      ? { status: "valid" }
      : { status: "invalid", message: "Card number failed checksum" };
  }

  if (digits.length < minLen) {
    return { status: "incomplete" };
  }

  const canStillGrow = expected.some((len) => len > digits.length);
  if (canStillGrow) return { status: "incomplete" };

  return { status: "invalid", message: "Enter a valid card number" };
}

export function isExpiryValid(month: string, year: string): boolean {
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) return false;
  const m = Number.parseInt(month, 10);
  if (m < 1 || m > 12) return false;
  const now = new Date();
  const expiry = new Date(2000 + Number.parseInt(year, 10), m);
  return expiry > now;
}

export type ValidationErrors = Partial<Record<keyof CardFormData, string>>;

export function validateCardForm(data: CardFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  const digits = data.cardNumber.replace(/\D/g, "");

  if (!data.label.trim()) errors.label = "Label is required";
  if (!data.cardholderName.trim()) {
    errors.cardholderName = "Cardholder name is required";
  }
  if (digits.length < 13 || digits.length > 19) {
    errors.cardNumber = "Enter a valid card number";
  } else if (!luhnCheck(digits)) {
    errors.cardNumber = "Card number failed checksum";
  }
  if (!isExpiryValid(data.expiryMonth, data.expiryYear)) {
    errors.expiryMonth = "Expiry must be in the future";
  }
  const brand = detectBrand(digits);
  const cvvLen = brand === "amex" ? 4 : 3;
  if (!new RegExp(`^\\d{${cvvLen}}$`).test(data.cvv)) {
    errors.cvv = `CVV must be ${cvvLen} digits`;
  }

  return errors;
}

export function isFormValid(data: CardFormData): boolean {
  return Object.keys(validateCardForm(data)).length === 0;
}

export function sanitizeCardNumberInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 19);
}

export function sanitizeCvvInput(value: string, brand: CardBrand): string {
  const max = brand === "amex" ? 4 : 3;
  return value.replace(/\D/g, "").slice(0, max);
}
