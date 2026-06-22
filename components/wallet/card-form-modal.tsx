"use client";

import { Dialog } from "@/components/ui/dialog";
import type { CardFormData, CardFormMode, CreditCard } from "@/lib/types";
import { CardForm } from "./card-form";

type CardFormModalProps = {
  open: boolean;
  mode: CardFormMode;
  card?: CreditCard;
  onClose: () => void;
  onSubmit: (data: CardFormData) => void | Promise<void>;
  onDelete?: () => void;
};

export function CardFormModal({
  open,
  mode,
  card,
  onClose,
  onSubmit,
  onDelete,
}: CardFormModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="overflow-y-auto p-4 min-[380px]:p-6 sm:p-7">
        <CardForm
          mode={mode}
          initialData={card}
          onSubmit={onSubmit}
          onCancel={onClose}
          confirmDelete={mode === "edit" ? onDelete : undefined}
        />
      </div>
    </Dialog>
  );
}
