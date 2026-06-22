import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const creditCards = pgTable("credit_cards", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  cardholderName: text("cardholder_name").notNull(),
  cardNumber: text("card_number").notNull(),
  expiryMonth: text("expiry_month").notNull(),
  expiryYear: text("expiry_year").notNull(),
  cvv: text("cvv").notNull(),
  brand: text("brand").notNull(),
  gradient: text("gradient").notNull(),
  colorSeed: text("color_seed").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type CreditCardRow = typeof creditCards.$inferSelect;
export type NewCreditCardRow = typeof creditCards.$inferInsert;
