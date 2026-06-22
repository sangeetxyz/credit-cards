"use client";

import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";

type EmptyStateProps = {
  onAdd: () => void;
};

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-[12px] border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-background-100)] px-4 py-12 text-center shadow-[var(--geist-shadow-raised)] min-[380px]:px-6 min-[380px]:py-16"
      {...fadeUp}
    >
      <div className="mb-8 flex h-[88px] w-[140px] items-center justify-center rounded-[8px] border border-dashed border-[var(--geist-gray-alpha-400)] bg-[var(--geist-background-200)]">
        <div className="h-10 w-14 rounded-[4px] border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-gray-100)]" />
      </div>
      <div className="max-w-sm space-y-2">
        <h2 className="text-heading-20 text-[var(--geist-gray-1000)]">
          No Cards Yet
        </h2>
        <p className="text-copy-13 text-[var(--geist-gray-900)] min-[380px]:text-copy-14">
          Add a card to keep your details handy. Everything syncs to your
          database.
        </p>
      </div>
      <Button onClick={onAdd} className="mt-8" size="lg">
        <Plus className="h-4 w-4" />
        Add Card
      </Button>
    </motion.div>
  );
}
