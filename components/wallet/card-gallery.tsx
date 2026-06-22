"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { fadeUp, GEIST_EASE } from "@/lib/motion";
import type { CreditCard } from "@/lib/types";
import { CardSkeleton } from "./card-skeleton";
import { CreditCardVisual } from "./credit-card-visual";
import { EmptyState } from "./empty-state";

type CardGalleryProps = {
  cards: CreditCard[];
  isHydrated: boolean;
  onAdd: () => void;
  onEdit: (card: CreditCard) => void;
  onDelete: (card: CreditCard) => void;
  onRerollColor: (card: CreditCard) => void;
};

const itemVariants = {
  initial: fadeUp.initial,
  animate: {
    ...fadeUp.animate,
    transition: fadeUp.transition,
  },
  exit: {
    ...fadeUp.exit,
    transition: { duration: 0.15, ease: GEIST_EASE },
  },
};

export function CardGallery({
  cards,
  isHydrated,
  onAdd,
  onEdit,
  onDelete,
  onRerollColor,
}: CardGalleryProps) {
  const reduceMotion = useReducedMotion();

  if (!isHydrated) {
    return (
      <div className="flex justify-center px-4 py-10">
        <CardSkeleton />
      </div>
    );
  }

  if (cards.length === 0) {
    return <EmptyState onAdd={onAdd} />;
  }

  const motionProps = reduceMotion
    ? {}
    : {
        variants: itemVariants,
        initial: "initial" as const,
        animate: "animate" as const,
        exit: "exit" as const,
      };

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 px-1 py-6 min-[380px]:gap-8 min-[380px]:px-2 min-[380px]:py-8 lg:grid-cols-2 xl:grid-cols-3"
      initial={false}
      animate={reduceMotion ? undefined : "animate"}
      variants={{
        animate: {
          transition: { staggerChildren: 0.07, delayChildren: 0.02 },
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layout={!reduceMotion}
            {...motionProps}
            className="flex w-full justify-center"
          >
            <CreditCardVisual
              card={card}
              onEdit={() => onEdit(card)}
              onDelete={() => onDelete(card)}
              onRerollColor={() => onRerollColor(card)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
