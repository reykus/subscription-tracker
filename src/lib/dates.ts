import type { BillingCycle, Subscription } from "../types";

/** Adds exactly one billing period to a date, respecting calendar month/year lengths. */
export function addPeriod(date: Date, cycle: BillingCycle, customDays?: number): Date {
  const d = new Date(date);
  switch (cycle) {
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      return d;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      return d;
    case "weekly":
      d.setDate(d.getDate() + 7);
      return d;
    case "custom":
      d.setDate(d.getDate() + Math.max(1, customDays ?? 30));
      return d;
    default:
      return d;
  }
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Walks forward from the subscription's anchor date to the next occurrence on/after `from`. */
export function nextPaymentDate(sub: Subscription, from: Date = new Date()): Date {
  const target = startOfDay(from);
  let cursor = startOfDay(new Date(sub.startDate));

  if (cursor >= target) return cursor;

  let guard = 0;
  while (cursor < target && guard < 20000) {
    cursor = addPeriod(cursor, sub.cycle, sub.customDays);
    guard++;
  }
  return cursor;
}

export function daysUntil(date: Date, from: Date = new Date()): number {
  const a = startOfDay(from).getTime();
  const b = startOfDay(date).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** Normalizes any billing cycle to an equivalent monthly cost, for the summary total. */
export function monthlyEquivalent(sub: Subscription): number {
  switch (sub.cycle) {
    case "monthly":
      return sub.price;
    case "yearly":
      return sub.price / 12;
    case "weekly":
      return (sub.price * 365.25) / 7 / 12;
    case "custom": {
      const days = Math.max(1, sub.customDays ?? 30);
      return (sub.price * 30.44) / days;
    }
    default:
      return sub.price;
  }
}

export function yearlyEquivalent(sub: Subscription): number {
  return monthlyEquivalent(sub) * 12;
}

/** All occurrences of a subscription's billing date that fall within [rangeStart, rangeEnd], inclusive. */
export function occurrencesInRange(sub: Subscription, rangeStart: Date, rangeEnd: Date): Date[] {
  const start = startOfDay(rangeStart);
  const end = startOfDay(rangeEnd);
  const out: Date[] = [];

  let cursor = nextPaymentDate(sub, start);
  let guard = 0;
  while (cursor <= end && guard < 5000) {
    out.push(cursor);
    cursor = addPeriod(cursor, sub.cycle, sub.customDays);
    guard++;
  }
  return out;
}
