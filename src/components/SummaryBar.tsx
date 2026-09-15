import type { Subscription } from "../types";
import { formatMoney } from "../lib/currency";
import { daysUntil, nextPaymentDate } from "../lib/dates";
import { totalsByCurrency } from "../lib/summary";

type Props = {
  subs: Subscription[];
};

export function SummaryBar({ subs }: Props) {
  const totals = totalsByCurrency(subs);

  const soonest = subs
    .map((s) => ({ sub: s, date: nextPaymentDate(s) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  return (
    <div className="summary-bar">
      <div className="summary-primary">
        <span className="summary-label">This month</span>
        {totals.length === 0 ? (
          <span className="summary-figure">—</span>
        ) : (
          <div className="summary-figures">
            {totals.map((t) => (
              <span className="summary-figure" key={t.currency}>
                {formatMoney(t.monthly, t.currency)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="summary-stats">
        <div className="summary-stat">
          <span className="summary-stat-value">{subs.length}</span>
          <span className="summary-stat-label">active subscriptions</span>
        </div>
        {soonest && (
          <div className="summary-stat">
            <span className="summary-stat-value" style={{ color: soonest.sub.color }}>
              {daysUntil(soonest.date) <= 0 ? "Today" : `${daysUntil(soonest.date)}d`}
            </span>
            <span className="summary-stat-label">until {soonest.sub.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
