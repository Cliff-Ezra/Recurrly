/**
 * Mock data for building the screens before there's a backend. Only the hooks
 * in src/hooks import this file, so swapping in real data happens there.
 *
 * Dates are relative to today so labels like "In 2 days" stay true.
 */
import type { ExchangeRates } from "@/lib/currency";
import { dayjs } from "@/lib/dates";
import type { BillingCycle, Money, Subscription, User } from "@/lib/types";

const today = dayjs().startOf("day");

const monthly: BillingCycle = { unit: "month", interval: 1 };

const visa = { brand: "Visa", last4: "8530" };
const mastercard = { brand: "Mastercard", last4: "4412" };

/** First charge for a plan whose next charge is `daysAway` from today. */
function startedBefore(daysAway: number, cycle: BillingCycle, pastCharges: number) {
  return today
    .add(daysAway, "day")
    .subtract(pastCharges * cycle.interval, cycle.unit)
    .toISOString();
}

const daysAgo = (days: number) => today.subtract(days, "day").toISOString();
const usd = (amount: number): Money => ({ amount, currency: "USD" });

export const mockUser: User = {
  name: "Ezra",
  email: "ezra@example.com",
};

/** Matches the design's Account screen: $260 a month. */
export const mockMonthlyBudget = usd(26000);

export const mockSubscriptions: Subscription[] = [
  {
    id: "notion",
    brand: "notion",
    name: "Notion",
    plan: "Team",
    price: usd(2000),
    cycle: monthly,
    category: "work",
    startDate: startedBefore(2, monthly, 14),
    status: "active",
    paymentMethod: visa,
    reminderDaysBefore: 1,
  },
  {
    id: "dropbox",
    brand: "dropbox",
    name: "Dropbox",
    plan: "Premium",
    price: usd(1696),
    cycle: monthly,
    category: "storage",
    startDate: startedBefore(4, monthly, 20),
    status: "active",
    paymentMethod: mastercard,
    reminderDaysBefore: 1,
  },
  {
    id: "github-copilot",
    brand: "github",
    name: "GitHub Copilot",
    plan: "Pro Business",
    price: usd(4999),
    cycle: monthly,
    category: "work",
    startDate: startedBefore(5, monthly, 8),
    status: "active",
    paymentMethod: visa,
    reminderDaysBefore: 1,
  },
  {
    id: "netflix",
    brand: "netflix",
    name: "Netflix",
    plan: "Premium",
    price: usd(3599),
    cycle: monthly,
    category: "entertainment",
    startDate: startedBefore(9, monthly, 30),
    status: "active",
    paymentMethod: mastercard,
  },
  {
    id: "figma",
    brand: "figma",
    name: "Figma",
    plan: "Professional",
    price: usd(1923),
    cycle: monthly,
    category: "work",
    startDate: startedBefore(16, monthly, 11),
    status: "active",
    paymentMethod: visa,
    reminderDaysBefore: 1,
  },
  {
    id: "adobe",
    brand: "adobe",
    name: "Adobe",
    plan: "Family",
    price: usd(9810),
    cycle: { unit: "month", interval: 2 },
    category: "creative",
    startDate: startedBefore(24, { unit: "month", interval: 2 }, 6),
    status: "active",
    paymentMethod: mastercard,
    reminderDaysBefore: 3,
  },
  {
    id: "spotify",
    brand: "spotify",
    name: "Spotify",
    plan: "Premium Family",
    price: usd(7677),
    cycle: { unit: "month", interval: 3 },
    category: "entertainment",
    startDate: startedBefore(41, { unit: "month", interval: 3 }, 5),
    status: "active",
    paymentMethod: visa,
  },

  // Paused, and billed in another currency, to exercise conversion
  {
    id: "showmax",
    brand: "showmax",
    name: "Showmax",
    plan: "Premier League",
    price: { amount: 49900, currency: "KES" },
    cycle: monthly,
    category: "entertainment",
    startDate: daysAgo(150),
    status: "paused",
    endedAt: daysAgo(18),
  },

  // Cancelled: their monthly cost is the Account screen's "Saved"
  {
    id: "icloud",
    brand: "icloud",
    name: "iCloud+",
    plan: "200 GB",
    price: usd(999),
    cycle: monthly,
    category: "storage",
    startDate: daysAgo(540),
    status: "cancelled",
    endedAt: daysAgo(12),
  },
  {
    id: "youtube",
    brand: "youtube",
    name: "YouTube Premium",
    plan: "Individual",
    price: usd(1399),
    cycle: monthly,
    category: "entertainment",
    startDate: daysAgo(400),
    status: "cancelled",
    endedAt: daysAgo(40),
  },
  {
    id: "disney-plus",
    brand: "disneyPlus",
    name: "Disney+",
    plan: "Standard",
    price: usd(1199),
    cycle: monthly,
    category: "entertainment",
    startDate: daysAgo(300),
    status: "cancelled",
    endedAt: daysAgo(25),
  },
];

/**
 * Units per 1 USD. Approximate, fixed values for development only; replace
 * with a rates API before showing converted totals to real users.
 */
export const mockRates: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.37,
  AUD: 1.52,
  JPY: 150,
  INR: 84,
  KES: 129,
  UGX: 3700,
  TZS: 2600,
  NGN: 1550,
  GHS: 15,
  ZAR: 18.2,
  EGP: 49,
};
