import type { Currency, Subscription } from "../types";
import { monthlyEquivalent, yearlyEquivalent } from "./dates";

export type CurrencyTotal = { currency: Currency; monthly: number; yearly: number };

export function totalsByCurrency(subs: Subscription[]): CurrencyTotal[] {
  const map = new Map<Currency, CurrencyTotal>();
  for (const sub of subs) {
    const existing = map.get(sub.currency) ?? { currency: sub.currency, monthly: 0, yearly: 0 };
    existing.monthly += monthlyEquivalent(sub);
    existing.yearly += yearlyEquivalent(sub);
    map.set(sub.currency, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.monthly - a.monthly);
}
