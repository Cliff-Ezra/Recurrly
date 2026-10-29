import dayjs, { type Dayjs } from "dayjs";

import type { BillingCycle } from "@/lib/types";

export { dayjs, type Dayjs };

/** "Sunday, 19 April" */
export function formatLongDate(date: Dayjs) {
  return date.format("dddd, D MMMM");
}

/** "Tue 21 Apr" */
export function formatShortDate(date: Dayjs) {
  return date.format("ddd D MMM");
}

/** "Good morning" / "Good afternoon" / "Good evening" */
export function greeting(now: Dayjs) {
  const hour = now.hour();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Whole calendar days from today to a date; negative when it's past. */
export function daysUntil(date: Dayjs, now: Dayjs) {
  return date.startOf("day").diff(now.startOf("day"), "day");
}

/** "Today", "Tomorrow", "In 2 days" */
export function dueLabel(date: Dayjs, now: Dayjs) {
  const days = daysUntil(date, now);
  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

/** "1d 22h 13m 39s", for the renewal countdown */
export function formatCountdown(date: Dayjs, now: Dayjs) {
  let seconds = Math.max(0, date.diff(now, "second"));
  const days = Math.floor(seconds / 86400);
  seconds -= days * 86400;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/** "weekly", "monthly", "every 2 months", "yearly" */
export function cycleLabel({ unit, interval }: BillingCycle) {
  if (interval === 1) {
    return { week: "weekly", month: "monthly", year: "yearly" }[unit];
  }
  return `every ${interval} ${unit}s`;
}

/**
 * The date of the nth charge, counted from the first. Counting from the start
 * each time (instead of adding a month to the previous charge) keeps a plan
 * that began on 31 Jan on the 31st, after billing on 28 Feb.
 */
export function chargeDate(start: Dayjs, cycle: BillingCycle, n: number) {
  return start.add(n * cycle.interval, cycle.unit);
}

/** Index of the first charge on or after a date. */
export function chargeIndexFrom(start: Dayjs, cycle: BillingCycle, date: Dayjs) {
  if (!date.isAfter(start, "day")) return 0;

  // Estimate, then step to the exact charge
  let n = Math.floor(date.diff(start, cycle.unit) / cycle.interval);
  while (n > 0 && !chargeDate(start, cycle, n - 1).isBefore(date, "day")) n--;
  while (chargeDate(start, cycle, n).isBefore(date, "day")) n++;
  return n;
}
