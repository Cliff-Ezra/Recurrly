import type { BrandId } from "@/constants/brands";

/**
 * An amount of money in minor units (cents), so 20.00 USD is
 * { amount: 2000, currency: "USD" }. Whole numbers avoid floating-point
 * rounding errors; convert to decimals only when displaying.
 */
export type Money = {
  amount: number;
  /** ISO 4217 code, e.g. "USD", "KES" */
  currency: string;
};

export type BillingCycle = {
  unit: "week" | "month" | "year";
  /** 2 with unit "month" means every 2 months */
  interval: number;
};

export type CategoryId = "work" | "entertainment" | "creative" | "storage";

export type PaymentMethod = {
  brand: string;
  last4: string;
};

export type SubscriptionStatus = "active" | "paused" | "cancelled";

export type Subscription = {
  id: string;
  /** A known service, for its logo and colour. Custom services leave it out. */
  brand?: BrandId;
  name: string;
  plan: string;
  price: Money;
  cycle: BillingCycle;
  category: CategoryId;
  /** ISO date of the first charge; every later charge is counted from it */
  startDate: string;
  status: SubscriptionStatus;
  /** ISO date it was paused or cancelled; no charges on or after it */
  endedAt?: string;
  paymentMethod?: PaymentMethod;
  /** Days before a renewal to send a reminder; leave out for none */
  reminderDaysBefore?: number;
};

export type User = {
  name: string;
  email: string;
};
