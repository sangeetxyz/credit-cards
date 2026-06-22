import { cn } from "./cn";
import type { CardBrand } from "./types";

type BrandIconProps = {
  brand: CardBrand;
  className?: string;
};

/** Shared wordmark typography — matches Geist / system UI on cards */
const WORDMARK = "var(--font-geist-sans), system-ui, -apple-system, sans-serif";

export function BrandIcon({ brand, className }: BrandIconProps) {
  switch (brand) {
    case "visa":
      return (
        <svg
          viewBox="0 0 52 18"
          className={cn("h-[17px] w-auto", className)}
          aria-label="Visa"
        >
          <title>Visa</title>
          <text
            x="0"
            y="14"
            fill="currentColor"
            fontSize="15"
            fontWeight="700"
            fontStyle="italic"
            fontFamily={WORDMARK}
            letterSpacing="0.14em"
          >
            VISA
          </text>
        </svg>
      );
    case "mastercard":
      return (
        <svg
          viewBox="0 0 36 22"
          className={cn("h-[22px] w-auto", className)}
          aria-label="Mastercard"
        >
          <title>Mastercard</title>
          <circle cx="13" cy="11" r="8.5" fill="#EB001B" />
          <circle cx="23" cy="11" r="8.5" fill="#F79E1B" />
          <path
            fill="#FF5F00"
            d="M18 4.8a8.5 8.5 0 0 0-3.2 6.2 8.5 8.5 0 0 0 3.2 6.2 8.5 8.5 0 0 0 3.2-6.2 8.5 8.5 0 0 0-3.2-6.2Z"
            opacity="0.95"
          />
        </svg>
      );
    case "amex":
      return (
        <svg
          viewBox="0 0 72 16"
          className={cn("h-[15px] w-auto", className)}
          aria-label="American Express"
        >
          <title>American Express</title>
          <text
            x="0"
            y="12"
            fill="currentColor"
            fontSize="10.5"
            fontWeight="600"
            fontFamily={WORDMARK}
            letterSpacing="0.1em"
          >
            AMERICAN EXPRESS
          </text>
        </svg>
      );
    case "discover":
      return (
        <svg
          viewBox="0 0 62 16"
          className={cn("h-[15px] w-auto", className)}
          aria-label="Discover"
        >
          <title>Discover</title>
          <text
            x="0"
            y="12"
            fill="currentColor"
            fontSize="11"
            fontWeight="600"
            fontFamily={WORDMARK}
            letterSpacing="0.12em"
          >
            DISCOVER
          </text>
        </svg>
      );
    case "rupay":
      return (
        <svg
          viewBox="0 0 64 20"
          className={cn("h-[18px] w-auto", className)}
          aria-label="RuPay"
        >
          <title>RuPay</title>
          <text
            x="0"
            y="14"
            fill="currentColor"
            fontSize="13"
            fontWeight="600"
            fontFamily={WORDMARK}
            letterSpacing="0.04em"
          >
            RuPay
          </text>
          <circle cx="48" cy="10" r="5.5" fill="#097939" />
          <circle cx="55" cy="10" r="5.5" fill="#F47920" />
        </svg>
      );
    default:
      return (
        <span
          className={cn(
            "text-[11px] font-medium tracking-wide text-white/35",
            className,
          )}
        >
          CARD
        </span>
      );
  }
}
