import type { Subscription } from "../types";
import { formatMoney } from "../lib/currency";
import { daysUntil, nextPaymentDate } from "../lib/dates";

type Props = {
  subs: Subscription[];
  reminderDays: number;
};

export function ReminderBanner({ subs, reminderDays }: Props) {
  const due = subs
    .map((sub) => ({ sub, date: nextPaymentDate(sub) }))
    .filter(({ sub, date }) => daysUntil(date) <= (sub.reminderDays ?? reminderDays))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (due.length === 0) return null;

  return (
    <div className="reminder-banner">
      <span className="reminder-banner-label">Coming up:</span>
      {due.map(({ sub, date }) => {
        const days = daysUntil(date);
        return (
          <span className="reminder-chip" key={sub.id}>
            <span className="sub-dot" style={{ background: sub.color }} />
            {sub.name} · {formatMoney(sub.price, sub.currency)} ·{" "}
            {days <= 0 ? "today" : days === 1 ? "tomorrow" : `in ${days}d`}
          </span>
        );
      })}
    </div>
  );
}
