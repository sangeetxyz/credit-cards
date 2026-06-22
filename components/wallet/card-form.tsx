"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandIcon } from "@/lib/brand-icons";
import {
  detectBrand,
  formatCardNumber,
  sanitizeCardNumberInput,
  sanitizeCvvInput,
  validateCardForm,
  validateCardNumber,
} from "@/lib/card-utils";
import type { CardFormData, CardFormMode, CreditCard } from "@/lib/types";

type CardFormProps = {
  mode: CardFormMode;
  initialData?: CreditCard;
  onSubmit: (data: CardFormData) => void;
  onCancel: () => void;
  confirmDelete?: () => void;
};

const emptyForm: CardFormData = {
  label: "",
  cardholderName: "Sangeet Banerjee",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
};

export function CardForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  confirmDelete,
}: CardFormProps) {
  const [form, setForm] = useState<CardFormData>(
    initialData
      ? {
          label: initialData.label,
          cardholderName: initialData.cardholderName,
          cardNumber: initialData.cardNumber,
          expiryMonth: initialData.expiryMonth,
          expiryYear: initialData.expiryYear,
          cvv: initialData.cvv,
        }
      : emptyForm,
  );
  const [touched, setTouched] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        label: initialData.label,
        cardholderName: initialData.cardholderName,
        cardNumber: initialData.cardNumber,
        expiryMonth: initialData.expiryMonth,
        expiryYear: initialData.expiryYear,
        cvv: initialData.cvv,
      });
    } else {
      setForm(emptyForm);
    }
    setTouched(false);
    setDeleteConfirm(false);
  }, [initialData]);

  const brand = detectBrand(form.cardNumber);
  const cardNumberValidation = validateCardNumber(form.cardNumber);
  const cvvMaxLength = brand === "amex" ? 4 : 3;
  const errors = touched ? validateCardForm(form) : {};
  const isValid = Object.keys(validateCardForm(form)).length === 0;

  const cardNumberError =
    cardNumberValidation.status === "invalid"
      ? cardNumberValidation.message
      : touched
        ? errors.cardNumber
        : undefined;

  const cardNumberHint =
    cardNumberValidation.status === "valid"
      ? "Card number verified"
      : undefined;

  const focusNext = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.focus();
  };

  const update = (patch: Partial<CardFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--geist-gray-alpha-400)] pb-5">
        <div className="space-y-1">
          <h2 className="text-heading-16 text-[var(--geist-gray-1000)]">
            {mode === "create" ? "New Card" : "Edit Card"}
          </h2>
          <p className="text-copy-13 text-[var(--geist-gray-900)] min-[380px]:text-copy-14">
            Saved to your Postgres database
          </p>
        </div>
        <div className="rounded-[6px] border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-background-200)] px-3 py-2">
          <BrandIcon brand={brand} className="text-[var(--geist-gray-1000)]" />
        </div>
      </div>

      <Input
        label="Label"
        placeholder="Personal · Travel"
        value={form.label}
        onChange={(e) => update({ label: e.target.value })}
        error={errors.label}
      />

      <Input
        label="Cardholder"
        placeholder="Name on card"
        value={form.cardholderName}
        onChange={(e) => update({ cardholderName: e.target.value })}
        error={errors.cardholderName}
        autoComplete="cc-name"
      />

      <Input
        id="number"
        label="Number"
        placeholder="0000 0000 0000 0000"
        inputMode="numeric"
        value={formatCardNumber(form.cardNumber)}
        onChange={(e) => {
          const next = sanitizeCardNumberInput(e.target.value);
          update({ cardNumber: next });
          const validation = validateCardNumber(next);
          if (validation.status === "valid") {
            focusNext(monthRef);
          }
        }}
        error={cardNumberError}
        hint={cardNumberHint}
        valid={cardNumberValidation.status === "valid"}
        autoComplete="cc-number"
        className="text-label-14-mono tracking-wide"
      />

      <div className="grid grid-cols-3 gap-2 min-[380px]:gap-3">
        <Input
          ref={monthRef}
          id="month"
          label="Month"
          placeholder="MM"
          inputMode="numeric"
          maxLength={2}
          value={form.expiryMonth}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 2);
            update({ expiryMonth: v });
            if (v.length === 2) focusNext(yearRef);
          }}
          error={errors.expiryMonth}
          autoComplete="cc-exp-month"
          className="text-label-14-mono"
        />
        <Input
          ref={yearRef}
          id="year"
          label="Year"
          placeholder="YY"
          inputMode="numeric"
          maxLength={2}
          value={form.expiryYear}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 2);
            update({ expiryYear: v });
            if (v.length === 2) focusNext(cvvRef);
          }}
          autoComplete="cc-exp-year"
          className="text-label-14-mono"
        />
        <Input
          ref={cvvRef}
          id="cvv"
          label="CVV"
          placeholder="···"
          type="text"
          inputMode="numeric"
          maxLength={cvvMaxLength}
          value={form.cvv}
          onChange={(e) => {
            update({ cvv: sanitizeCvvInput(e.target.value, brand) });
          }}
          error={errors.cvv}
          autoComplete="off"
          className="text-label-14-mono"
        />
      </div>

      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <Button type="submit" className="flex-1" disabled={touched && !isValid}>
          {mode === "create" ? "Save Card" : "Save Changes"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {mode === "edit" && confirmDelete && (
        <div className="rounded-[6px] border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-background-200)] p-4">
          {!deleteConfirm ? (
            <Button
              type="button"
              variant="danger"
              className="w-full"
              onClick={() => setDeleteConfirm(true)}
            >
              Remove Card
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-copy-13 text-[var(--geist-gray-900)] min-[380px]:text-copy-14">
                This card will be permanently removed from your database.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="danger"
                  className="flex-1"
                  onClick={confirmDelete}
                >
                  Confirm Remove
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  onClick={() => setDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
