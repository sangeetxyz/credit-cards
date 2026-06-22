"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/cn";
import { GEIST_EASE } from "@/lib/motion";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  mobileSheet?: boolean;
};

export function Dialog({
  open,
  onClose,
  children,
  className,
  mobileSheet = true,
}: DialogProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const duration = reduceMotion ? 0 : 0.3;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="fixed inset-0 z-40 bg-[var(--geist-gray-alpha-700)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration * 0.6, ease: GEIST_EASE }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "fixed z-50 flex flex-col border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-background-100)]",
              mobileSheet
                ? "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[12px] shadow-[var(--geist-shadow-modal)] md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-[440px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[12px]"
                : "left-1/2 top-1/2 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-[12px] shadow-[var(--geist-shadow-modal)]",
              className,
            )}
            initial={
              mobileSheet
                ? { opacity: 0, y: reduceMotion ? 0 : 16 }
                : {
                    opacity: 0,
                    scale: reduceMotion ? 1 : 0.98,
                    x: "-50%",
                    y: "-50%",
                  }
            }
            animate={
              mobileSheet
                ? { opacity: 1, y: 0 }
                : { opacity: 1, scale: 1, x: "-50%", y: "-50%" }
            }
            exit={
              mobileSheet
                ? { opacity: 0, y: reduceMotion ? 0 : 12 }
                : {
                    opacity: 0,
                    scale: reduceMotion ? 1 : 0.99,
                    x: "-50%",
                    y: "-50%",
                  }
            }
            transition={{ duration, ease: GEIST_EASE }}
          >
            {mobileSheet && (
              <div className="mx-auto mt-3 h-1 w-9 shrink-0 rounded-full bg-[var(--geist-gray-300)] md:hidden" />
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
