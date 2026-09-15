export type BillingCycle = "monthly" | "yearly" | "weekly" | "custom";

export type Currency = "USD" | "EUR" | "SEK" | "UAH" | "GBP";

export type Subscription = {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  cycle: BillingCycle;
  /** Only used when cycle === "custom": bill every N days. */
  customDays?: number;
  /** The date of the first (or a known) payment — cycles are computed forward from this anchor. */
  startDate: string; // ISO date, YYYY-MM-DD
  notes?: string;
  /** Override the global reminder threshold for this subscription specifically. */
  reminderDays?: number;
  /** Accent color for calendar dots / list marker, assigned at creation. */
  color: string;
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  SEK: "kr",
  UAH: "₴",
  GBP: "£",
};

export const CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
  weekly: "Weekly",
  custom: "Custom",
};

export const ACCENT_PALETTE = [
  "#34d399",
  "#fbbf24",
  "#a78bfa",
  "#f472b6",
  "#60a5fa",
  "#fb923c",
  "#4fd8ea",
  "#f87171",
];

export function pickColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENT_PALETTE[hash % ACCENT_PALETTE.length];
}
