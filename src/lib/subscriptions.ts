/**
 * Everything the screens show is worked out from the list of subscriptions:
 * next renewal, monthly cost, past charges, spending by category. When real
 * data arrives these keep working, because they only depend on the types.
 */
import { sumMoney } from "@/lib/currency";
import {
  chargeDate,
  chargeIndexFrom,
  daysUntil,
  dayjs,
  type Dayjs,
} from "@/lib/dates";
import type { CategoryId, Money, Subscription } from "@/lib/types";

/** Converts money into the currency the user sees. */
export type Converter = (money: Money) => Money;

export type Charge = {
  subscription: Subscription;
  date: Dayjs;
};

export type Renewal = Charge & {
  /** Whole days until the charge; 0 is today */
  days: number;
};

/** Next charge on or after today, or null if it won't renew. */
export function nextCharge(subscription: Subscription, now: Dayjs) {
  if (subscription.status !== "active") return null;

  const start = dayjs(subscription.startDate);
  const n = chargeIndexFrom(start, subscription.cycle, now);
  return chargeDate(start, subscription.cycle, n);
}

/** Where today sits in the billing period: "Day 25 of 30". */
export function billingPeriod(subscription: Subscription, now: Dayjs) {
  const start = dayjs(subscription.startDate);
  const n = chargeIndexFrom(start, subscription.cycle, now);
  const periodStart = chargeDate(start, subscription.cycle, Math.max(0, n - 1));
  const periodEnd = chargeDate(start, subscription.cycle, n);
  const length = Math.max(1, periodEnd.diff(periodStart, "day"));
  const day = Math.min(length, Math.max(0, now.diff(periodStart, "day")));
  return { day, length, progress: day / length, renewsOn: periodEnd };
}

/** Active subscriptions by next charge, soonest first. */
export function upcomingRenewals(subscriptions: Subscription[], now: Dayjs) {
  return subscriptions
    .flatMap((subscription): Renewal[] => {
      const date = nextCharge(subscription, now);
      return date ? [{ subscription, date, days: daysUntil(date, now) }] : [];
    })
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());
}

/** Cost spread over a month: $98.10 every 2 months is $49.05 a month. */
export function monthlyCost({ price, cycle }: Subscription): Money {
  const perMonth = { week: 52 / 12, month: 1, year: 1 / 12 }[cycle.unit];
  return {
    amount: Math.round((price.amount * perMonth) / cycle.interval),
    currency: price.currency,
  };
}

/** Total monthly cost of subscriptions, in the user's currency. */
export function monthlyTotal(
  subscriptions: Subscription[],
  convert: Converter,
  currency: string,
) {
  return sumMoney(
    subscriptions.map((subscription) => convert(monthlyCost(subscription))),
    currency,
  );
}

/** Every charge between two dates (inclusive), oldest first. */
export function chargesBetween(
  subscriptions: Subscription[],
  from: Dayjs,
  to: Dayjs,
) {
  const charges: Charge[] = [];

  for (const subscription of subscriptions) {
    const start = dayjs(subscription.startDate);
    const endedAt = subscription.endedAt ? dayjs(subscription.endedAt) : null;

    for (let n = chargeIndexFrom(start, subscription.cycle, from); ; n++) {
      const date = chargeDate(start, subscription.cycle, n);
      if (date.isAfter(to, "day")) break;
      if (endedAt && !date.isBefore(endedAt, "day")) break;
      charges.push({ subscription, date });
    }
  }

  return charges.sort((a, b) => a.date.valueOf() - b.date.valueOf());
}

/** Total of a list of charges, in the user's currency. */
export function chargesTotal(
  charges: Charge[],
  convert: Converter,
  currency: string,
) {
  return sumMoney(
    charges.map((charge) => convert(charge.subscription.price)),
    currency,
  );
}

/** Spending per day, for the Insights bar chart. Index 0 is `from`. */
export function dailyTotals(
  charges: Charge[],
  from: Dayjs,
  to: Dayjs,
  convert: Converter,
) {
  const days = new Array<number>(to.diff(from, "day") + 1).fill(0);
  for (const charge of charges) {
    const index = charge.date.diff(from.startOf("day"), "day");
    if (index >= 0 && index < days.length) {
      days[index] += convert(charge.subscription.price).amount;
    }
  }
  return days;
}

export type CategorySpend = {
  category: CategoryId;
  total: Money;
  /** 0–1 share of all spending */
  share: number;
  /** Service names, biggest spend first */
  names: string[];
};

/** The "By category" list on Insights, biggest first. */
export function spendByCategory(
  charges: Charge[],
  convert: Converter,
  currency: string,
): CategorySpend[] {
  const groups = new Map<CategoryId, Map<string, number>>();
  for (const { subscription } of charges) {
    const names = groups.get(subscription.category) ?? new Map();
    const amount = convert(subscription.price).amount;
    names.set(subscription.name, (names.get(subscription.name) ?? 0) + amount);
    groups.set(subscription.category, names);
  }

  const grandTotal = chargesTotal(charges, convert, currency).amount;

  return [...groups]
    .map(([category, names]) => {
      const amount = [...names.values()].reduce((sum, value) => sum + value, 0);
      return {
        category,
        total: { amount, currency },
        share: grandTotal > 0 ? amount / grandTotal : 0,
        names: [...names].sort((a, b) => b[1] - a[1]).map(([name]) => name),
      };
    })
    .sort((a, b) => b.total.amount - a.total.amount);
}

/** The filter chips on the Subscriptions screen. */
export type PlanFilter = "all" | "week" | "monthly" | "longer";

export function matchesFilter(renewal: Renewal, filter: PlanFilter) {
  const { unit, interval } = renewal.subscription.cycle;
  const isMonthly = unit === "month" && interval === 1;
  switch (filter) {
    case "all":
      return true;
    case "week":
      return renewal.days <= 7;
    case "monthly":
      return isMonthly;
    case "longer":
      return unit === "year" || (unit === "month" && interval > 1);
  }
}

/** "AH" for "Adrian Hajdin" */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
