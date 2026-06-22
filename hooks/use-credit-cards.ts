"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { CardFormData, CreditCard } from "@/lib/types";

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      typeof payload?.error === "string" ? payload.error : "Request failed",
    );
  }
  return payload as T;
}

export function useCreditCards() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await readJson<CreditCard[]>(await fetch("/api/cards"));
    setCards(next);
    return next;
  }, []);

  useEffect(() => {
    try {
      localStorage.removeItem("credit-cards:v1");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const next = await refresh();
        if (!cancelled) setCards(next);
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load cards",
          );
        }
      } finally {
        if (!cancelled) {
          setIsHydrated(true);
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const addCard = useCallback(async (data: CardFormData) => {
    const card = await readJson<CreditCard>(
      await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    );
    setCards((current) => [...current, card]);
    return card;
  }, []);

  const updateCard = useCallback(async (id: string, data: CardFormData) => {
    const card = await readJson<CreditCard>(
      await fetch(`/api/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    );
    setCards((current) =>
      current.map((item) => (item.id === id ? card : item)),
    );
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    await readJson<{ deleted: true }>(
      await fetch(`/api/cards/${id}`, { method: "DELETE" }),
    );
    setCards((current) => current.filter((card) => card.id !== id));
  }, []);

  const rerollCardColor = useCallback(async (id: string) => {
    const card = await readJson<CreditCard>(
      await fetch(`/api/cards/${id}/color`, { method: "POST" }),
    );
    setCards((current) =>
      current.map((item) => (item.id === id ? card : item)),
    );
    return card;
  }, []);

  return {
    cards,
    isHydrated,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    rerollCardColor,
    refresh,
  };
}
