import type { Subscription } from "../types";

const SUBS_KEY = "subtrack:subscriptions:v1";
const SEEDED_KEY = "subtrack:seeded:v1";
const REMINDER_KEY = "subtrack:reminder-days:v1";

export function loadSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(SUBS_KEY);
    return raw ? (JSON.parse(raw) as Subscription[]) : [];
  } catch {
    return [];
  }
}

export function saveSubscriptions(subs: Subscription[]) {
  try {
    localStorage.setItem(SUBS_KEY, JSON.stringify(subs));
  } catch {
    // Storage full or unavailable (private browsing) — fail silently, the
    // app still works for the session, it just won't persist.
  }
}

export function hasSeededBefore(): boolean {
  return localStorage.getItem(SEEDED_KEY) === "1";
}

export function markSeeded() {
  try {
    localStorage.setItem(SEEDED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function loadReminderDays(): number {
  const raw = localStorage.getItem(REMINDER_KEY);
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
}

export function saveReminderDays(days: number) {
  try {
    localStorage.setItem(REMINDER_KEY, String(days));
  } catch {
    /* ignore */
  }
}
