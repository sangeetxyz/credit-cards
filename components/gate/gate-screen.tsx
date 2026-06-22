"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { verifyGatePassword } from "@/app/actions/gate";
import { cn } from "@/lib/cn";

const PIN_LENGTH = 4;

export function GateScreen() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const submitPin = async (value: string) => {
    if (value.length !== PIN_LENGTH || submitting) return;

    setSubmitting(true);
    setError(false);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const result = await verifyGatePassword(value, timeZone);

    if (result.ok) {
      setPin("");
      router.refresh();
      return;
    }

    setError(true);
    setPin("");
    setSubmitting(false);
    focusInput();
  };

  const handleChange = (value: string) => {
    const next = value.replace(/\D/g, "").slice(0, PIN_LENGTH);
    setPin(next);
    setError(false);

    if (next.length === PIN_LENGTH) {
      void submitPin(next);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-dvh items-center justify-center bg-[var(--geist-background-200)]"
      onClick={focusInput}
      onKeyDown={undefined}
    >
      <div className="flex flex-col items-center gap-8 px-6">
        <motion.div
          animate={error ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-4"
        >
          {Array.from({ length: PIN_LENGTH }, (_, index) => {
            const filled = pin.length > index;
            const active = pin.length === index;

            return (
              <div
                key={index}
                className={cn(
                  "h-3.5 w-3.5 rounded-full border transition-colors duration-150",
                  filled
                    ? "border-[var(--geist-gray-1000)] bg-[var(--geist-gray-1000)]"
                    : "border-[var(--geist-gray-alpha-500)] bg-transparent",
                  active && !filled && "border-[var(--geist-gray-800)]",
                  error && "border-[var(--geist-red-800)]",
                  error && filled && "bg-[var(--geist-red-800)]",
                )}
              />
            );
          })}
        </motion.div>

        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={PIN_LENGTH}
          value={pin}
          disabled={submitting}
          aria-label="Enter 4-digit access code"
          className="sr-only"
          onChange={(event) => handleChange(event.target.value)}
        />

        {error ? (
          <p className="text-label-13 text-[var(--geist-red-800)]">
            Incorrect code
          </p>
        ) : (
          <p className="h-4" aria-hidden />
        )}
      </div>
    </div>
  );
}
