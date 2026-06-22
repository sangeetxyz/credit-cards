export type CardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "rupay"
  | "unknown";

export type CreditCard = {
  id: string;
  label: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  brand: CardBrand;
  gradient: string;
  colorSeed: string;
};

export type CardFormData = Omit<CreditCard, "id" | "brand" | "gradient" | "colorSeed">;

export type CardFormMode = "create" | "edit";
