import type { Subscription } from "../types";
import { CYCLE_LABELS } from "../types";
import { formatMoney } from "../lib/currency";
import { daysUntil, nextPaymentDate } from "../lib/dates";

type Props = {
  subs: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  reminderDays: number;
};

function urgency(days: number, reminderDays: number): "urgent" | "warn" | "normal" {
  if (days <= 1) return "urgent";
  if (days <= reminderDays) return "warn";
  return "normal";
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function SubscriptionList({ subs, onEdit, onDelete, reminderDays }: Props) {
  if (subs.length === 0) {
    return (
      <div className="empty-state">
        <p>No subscriptions yet.</p>
        <p className="hint">Add one with the button above to start tracking what renews and when.</p>
      </div>
    );
  }

  const rows = subs
    .map((sub) => {
      const date = nextPaymentDate(sub);
      return { sub, date, days: daysUntil(date) };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <ul className="sub-list">
      {rows.map(({ sub, date, days }) => {
        const level = urgency(days, sub.reminderDays ?? reminderDays);
        return (
          <li className={`sub-row sub-row-${level}`} key={sub.id}>
            <span className="sub-dot" style={{ background: sub.color }} />
            <div className="sub-main">
              <span className="sub-name">{sub.name}</span>
              <span className="sub-meta">
                {CYCLE_LABELS[sub.cycle]}
                {sub.cycle === "custom" && sub.customDays ? ` (${sub.customDays}d)` : ""}
              </span>
            </div>
            <span className="sub-price">{formatMoney(sub.price, sub.currency)}</span>
            <span className="sub-date">{formatDate(date)}</span>
            <span className={`sub-badge sub-badge-${level}`}>
              {days <= 0 ? "Due" : days === 1 ? "Tomorrow" : `${days}d`}
            </span>
            <div className="sub-actions">
              <button type="button" onClick={() => onEdit(sub)} aria-label={`Edit ${sub.name}`}>
                Edit
              </button>
              <button type="button" onClick={() => onDelete(sub.id)} aria-label={`Delete ${sub.name}`}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
