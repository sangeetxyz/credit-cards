"use client";

import { Check, Palette, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { BrandIcon } from "@/lib/brand-icons";
import { getCardColorStyle } from "@/lib/card-color";
import { formatCardNumber } from "@/lib/card-utils";
import { cn } from "@/lib/cn";
import type { CreditCard } from "@/lib/types";
import { CardTilt3D } from "./card-tilt";
import { CardAccentLayers } from "./chip-icon";

type CreditCardVisualProps = {
  card: CreditCard;
  onEdit: () => void;
  onDelete: () => void;
  onRerollColor: () => void;
  className?: string;
};

const tileTransition = {
  duration: 0.22,
  ease: [0.4, 0, 0.2, 1] as const,
};

type CopiedField = "number" | "cvv" | "expiry";

const copyMessages: Record<CopiedField, string> = {
  number: "Number copied",
  cvv: "Security code copied",
  expiry: "Expiry copied",
};

const COPY_FEEDBACK_MS = 3000;

function TapToCopy({
  children,
  onCopy,
  copied,
  ariaLabel,
  className,
}: {
  children: React.ReactNode;
  onCopy: () => void;
  copied?: boolean;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onCopy();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onCopy();
        }
      }}
      aria-label={copied ? `${ariaLabel} copied` : ariaLabel}
      title="Tap to copy"
      className={cn(
        "cursor-pointer rounded-[6px] px-1 -mx-1 transition-colors hover:bg-white/5 active:bg-white/8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardNumberHero({
  number,
  onCopy,
  copied,
}: {
  number: string;
  onCopy: () => void;
  copied?: boolean;
}) {
  const digits = number.replace(/\D/g, "");
  const last4 = digits.slice(-4);

  if (last4.length < 4) {
    return (
      <span className="text-label-14-mono text-white/40">
        Enter card number
      </span>
    );
  }

  return (
    <TapToCopy
      onCopy={onCopy}
      copied={copied}
      ariaLabel="Copy card number"
      className="flex w-fit items-baseline gap-3"
    >
      <span className="text-label-14-mono tracking-[0.18em] text-white/28">
        ••••
      </span>
      <span className="inline-flex h-7 items-center text-[20px] font-semibold font-mono tabular-nums tracking-[0.06em] min-[380px]:h-8 min-[380px]:text-heading-24">
        <span
          aria-hidden={!copied}
          className={cn(
            "inline-flex shrink-0 overflow-hidden transition-[width,margin] duration-150",
            copied ? "mr-1.5 w-4" : "mr-0 w-0",
          )}
        >
          <Check className="h-4 w-4 text-emerald-300" />
        </span>
        <span className={copied ? "text-emerald-300" : "text-white/95"}>
          {last4}
        </span>
      </span>
    </TapToCopy>
  );
}

function CopyableDetailField({
  label,
  value,
  onCopy,
  copied,
  mono = false,
  ariaLabel,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied?: boolean;
  mono?: boolean;
  ariaLabel: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-label-12 text-white/40">{label}</p>
      <TapToCopy
        onCopy={onCopy}
        copied={copied}
        ariaLabel={ariaLabel}
        className="mt-1 w-fit"
      >
        <p
          className={cn(
            "inline-flex h-5 items-center truncate text-label-14",
            mono && "font-mono tabular-nums tracking-wide",
            copied ? "text-emerald-300" : "text-white/88",
          )}
        >
          <span
            aria-hidden={!copied}
            className={cn(
              "inline-flex shrink-0 overflow-hidden transition-[width,margin] duration-150",
              copied ? "mr-1 w-3.5" : "mr-0 w-0",
            )}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
          </span>
          {value}
        </p>
      </TapToCopy>
    </div>
  );
}

export function CreditCardVisual({
  card,
  onEdit,
  onDelete,
  onRerollColor,
  className,
}: CreditCardVisualProps) {
  const [flipped, setFlipped] = useState(false);
  const [copiedField, setCopiedField] = useState<CopiedField | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const accentStyle = getCardColorStyle(card);
  const expiry = `${card.expiryMonth}/${card.expiryYear}`;

  const copyField = async (field: CopiedField, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(copyMessages[field], { duration: COPY_FEEDBACK_MS });
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(
      () => setCopiedField(null),
      COPY_FEEDBACK_MS,
    );
  };

  const faceMotion = reduceMotion
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
      };

  return (
    <CardTilt3D
      disabled={flipped}
      className={cn(
        "group relative w-full max-w-[360px] max-[380px]:max-w-full",
        className,
      )}
    >
      <div className="card-tile-scene relative aspect-[1.586/1] w-full">
        <AnimatePresence mode="wait" initial={false}>
          {!flipped ? (
            <motion.button
              key="front"
              type="button"
              onClick={() => setFlipped(true)}
              aria-label={`${card.label}, show details`}
              className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              {...faceMotion}
              transition={reduceMotion ? { duration: 0 } : tileTransition}
            >
              <div
                className="card-surface h-full p-4 min-[380px]:p-5 sm:p-6"
                style={accentStyle}
              >
                <CardAccentLayers />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-heading-16 text-white/90">
                      {card.label}
                    </p>
                    <BrandIcon
                      brand={card.brand}
                      className="shrink-0 text-white/55"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-center py-2">
                    <CardNumberHero
                      number={card.cardNumber}
                      onCopy={() => copyField("number", card.cardNumber)}
                      copied={copiedField === "number"}
                    />
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <p className="min-w-0 truncate text-label-13 text-white/55">
                      {card.cardholderName}
                    </p>
                    <span className="shrink-0 font-mono text-label-12 tabular-nums text-white/40">
                      {expiry}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="back"
              role="button"
              tabIndex={0}
              onClick={() => setFlipped(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped(false);
                }
              }}
              aria-label={`${card.label}, back to summary`}
              className="absolute inset-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              {...faceMotion}
              transition={reduceMotion ? { duration: 0 } : tileTransition}
            >
              <div
                className="card-surface h-full p-4 min-[380px]:p-5 sm:p-6"
                style={accentStyle}
              >
                <CardAccentLayers />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="space-y-4">
                      <div>
                        <p className="mb-1 text-label-12 text-white/40">
                          Number
                        </p>
                        <TapToCopy
                          onCopy={() => copyField("number", card.cardNumber)}
                          copied={copiedField === "number"}
                          ariaLabel="Copy card number"
                          className="w-fit"
                        >
                          <p
                            className={cn(
                              "inline-flex h-5 items-center text-label-14-mono tracking-wide",
                              copiedField === "number"
                                ? "text-emerald-300"
                                : "text-white/85",
                            )}
                          >
                            <span
                              aria-hidden={copiedField !== "number"}
                              className={cn(
                                "inline-flex shrink-0 overflow-hidden transition-[width,margin] duration-150",
                                copiedField === "number"
                                  ? "mr-1 w-3.5"
                                  : "mr-0 w-0",
                              )}
                            >
                              <Check className="h-3.5 w-3.5" aria-hidden />
                            </span>
                            {formatCardNumber(card.cardNumber)}
                          </p>
                        </TapToCopy>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <CopyableDetailField
                          label="Security code"
                          value={card.cvv}
                          onCopy={() => copyField("cvv", card.cvv)}
                          copied={copiedField === "cvv"}
                          ariaLabel="Copy security code"
                          mono
                        />
                        <CopyableDetailField
                          label="Expires"
                          value={expiry}
                          onCopy={() => copyField("expiry", expiry)}
                          copied={copiedField === "expiry"}
                          ariaLabel="Copy expiry date"
                          mono
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3">
                      <BrandIcon brand={card.brand} className="text-white/35" />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRerollColor();
                          }}
                          aria-label="Change card color"
                          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-white/55 transition-colors hover:bg-white/6 hover:text-white/90"
                        >
                          <Palette className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                          }}
                          aria-label="Edit card"
                          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-white/55 transition-colors hover:bg-white/6 hover:text-white/90"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                          }}
                          aria-label="Delete card"
                          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-red-400/75 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardTilt3D>
  );
}
