"use client";

import { Plus, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreditCards } from "@/hooks/use-credit-cards";
import { fadeUp } from "@/lib/motion";
import type { CardFormData, CreditCard } from "@/lib/types";
import { CardFormModal } from "./card-form-modal";
import { CardGallery } from "./card-gallery";

type ModalState =
  | { open: false }
  | { open: true; mode: "create" }
  | { open: true; mode: "edit"; card: CreditCard };

export function WalletShell() {
  const { cards, isHydrated, addCard, updateCard, deleteCard, rerollCardColor } =
    useCreditCards();
  const [modal, setModal] = useState<ModalState>({ open: false });

  const openCreate = () => setModal({ open: true, mode: "create" });
  const openEdit = (card: CreditCard) =>
    setModal({ open: true, mode: "edit", card });
  const closeModal = () => setModal({ open: false });

  const handleFormSubmit = async (data: CardFormData) => {
    try {
      if (modal.open && modal.mode === "edit") {
        await updateCard(modal.card.id, data);
        toast.success("Card updated");
      } else {
        await addCard(data);
        toast.success("Card saved");
      }
      closeModal();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save card",
      );
    }
  };

  const handleFormDelete = async () => {
    if (modal.open && modal.mode === "edit") {
      try {
        await deleteCard(modal.card.id);
        toast.success("Card removed");
        closeModal();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to remove card",
        );
      }
    }
  };

  const handleRerollColor = async (card: CreditCard) => {
    try {
      await rerollCardColor(card.id);
      toast.success("Card color updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update color",
      );
    }
  };

  return (
    <div className="wallet-bg relative">
      <div className="relative z-10 mx-auto min-h-dvh max-w-[1200px] px-3 pb-24 pt-8 min-[380px]:px-4 min-[380px]:pb-28 min-[380px]:pt-10 sm:px-6 sm:pt-12">
        <motion.header
          className="mb-6 flex items-center justify-between gap-4 min-[380px]:mb-8 sm:mb-10"
          {...fadeUp}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--geist-radius-sm)] border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-gray-alpha-100)]"
            >
              <Wallet className="h-4 w-4 text-[var(--geist-gray-800)]" />
            </span>

            <div className="min-w-0">
              <p className="text-label-12 text-[var(--geist-gray-700)]">
                Card Vault
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <h1 className="text-heading-20 tracking-[-0.4px] text-[var(--geist-gray-1000)] sm:text-heading-24 sm:tracking-[-0.96px]">
                  Wallet
                </h1>
                {isHydrated ? (
                  <span className="inline-flex items-center rounded-full border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-gray-alpha-100)] px-2 py-0.5 text-label-12 text-[var(--geist-gray-800)]">
                    <span className="font-mono tabular-nums text-[var(--geist-gray-1000)]">
                      {cards.length}
                    </span>
                    <span className="ml-1">
                      {cards.length === 1 ? "card" : "cards"}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <Button onClick={openCreate} className="hidden shrink-0 md:inline-flex">
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </motion.header>

        <CardGallery
          cards={cards}
          isHydrated={isHydrated}
          onAdd={openCreate}
          onEdit={openEdit}
          onDelete={openEdit}
          onRerollColor={handleRerollColor}
        />
      </div>

      <motion.div
        className="fixed bottom-4 right-3 z-30 min-[380px]:bottom-6 min-[380px]:right-4 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <Button
          onClick={openCreate}
          size="icon"
          className="rounded-[var(--radius-fab)] shadow-[var(--geist-shadow-popover)]"
          aria-label="Add Card"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </motion.div>

      <CardFormModal
        open={modal.open}
        mode={modal.open ? modal.mode : "create"}
        card={modal.open && modal.mode === "edit" ? modal.card : undefined}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        onDelete={
          modal.open && modal.mode === "edit" ? handleFormDelete : undefined
        }
      />
    </div>
  );
}
