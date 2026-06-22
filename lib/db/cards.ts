import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { deriveCardColorSignature } from "@/lib/card-color";
import { createRandomColorSeed } from "@/lib/server/random-color-seed";
import { detectBrand } from "@/lib/card-utils";
import type { CardFormData, CreditCard } from "@/lib/types";
import { getDb } from "./index";
import { type CreditCardRow, creditCards } from "./schema";

function toCreditCard(row: CreditCardRow): CreditCard {
  return {
    id: row.id,
    label: row.label,
    cardholderName: row.cardholderName,
    cardNumber: row.cardNumber,
    expiryMonth: row.expiryMonth,
    expiryYear: row.expiryYear,
    cvv: row.cvv,
    brand: row.brand as CreditCard["brand"],
    gradient: row.gradient,
    colorSeed: row.colorSeed,
  };
}

function toColorInput(
  row: Pick<
    CreditCardRow,
    | "id"
    | "label"
    | "cardholderName"
    | "cardNumber"
    | "expiryMonth"
    | "expiryYear"
    | "brand"
    | "colorSeed"
  >,
): CreditCard {
  return {
    id: row.id,
    label: row.label,
    cardholderName: row.cardholderName,
    cardNumber: row.cardNumber,
    expiryMonth: row.expiryMonth,
    expiryYear: row.expiryYear,
    cvv: "",
    brand: row.brand as CreditCard["brand"],
    gradient: "",
    colorSeed: row.colorSeed,
  };
}

export async function listCreditCards(): Promise<CreditCard[]> {
  const rows = await getDb()
    .select()
    .from(creditCards)
    .orderBy(asc(creditCards.createdAt));
  return rows.map(toCreditCard);
}

export async function createCreditCard(
  data: CardFormData,
): Promise<CreditCard> {
  const id = nanoid();
  const brand = detectBrand(data.cardNumber);
  const draft = { id, ...data, brand, colorSeed: "", gradient: "" };
  const row = {
    ...draft,
    gradient: deriveCardColorSignature(draft),
  };

  const [created] = await getDb().insert(creditCards).values(row).returning();
  return toCreditCard(created);
}

export async function updateCreditCard(
  id: string,
  data: CardFormData,
): Promise<CreditCard | null> {
  const [existing] = await getDb()
    .select()
    .from(creditCards)
    .where(eq(creditCards.id, id))
    .limit(1);

  if (!existing) return null;

  const brand = detectBrand(data.cardNumber);
  const draft = toColorInput({ ...existing, ...data, brand });
  const [updated] = await getDb()
    .update(creditCards)
    .set({
      label: data.label,
      cardholderName: data.cardholderName,
      cardNumber: data.cardNumber,
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
      cvv: data.cvv,
      brand,
      gradient: deriveCardColorSignature(draft),
    })
    .where(eq(creditCards.id, id))
    .returning();

  return updated ? toCreditCard(updated) : null;
}

export async function rerollCardColor(id: string): Promise<CreditCard | null> {
  const [existing] = await getDb()
    .select()
    .from(creditCards)
    .where(eq(creditCards.id, id))
    .limit(1);

  if (!existing) return null;

  const colorSeed = createRandomColorSeed();
  const draft = toColorInput({ ...existing, colorSeed });
  const [updated] = await getDb()
    .update(creditCards)
    .set({
      colorSeed,
      gradient: deriveCardColorSignature(draft),
    })
    .where(eq(creditCards.id, id))
    .returning();

  return updated ? toCreditCard(updated) : null;
}

export async function deleteCreditCard(id: string): Promise<boolean> {
  const deleted = await getDb()
    .delete(creditCards)
    .where(eq(creditCards.id, id))
    .returning({ id: creditCards.id });
  return deleted.length > 0;
}
