import type { Currency } from "../types";

const LOCALE_BY_CURRENCY: Record<Currency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  SEK: "sv-SE",
  UAH: "uk-UA",
  GBP: "en-GB",
};

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
