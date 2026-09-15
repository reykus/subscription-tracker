import { useState } from "react";
import type { BillingCycle, Currency, Subscription } from "../types";
import { CYCLE_LABELS, CURRENCY_SYMBOLS } from "../types";

type Props = {
  initial?: Subscription;
  onSave: (input: Omit<Subscription, "id" | "color">) => void;
  onClose: () => void;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export function SubscriptionForm({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? "USD");
  const [cycle, setCycle] = useState<BillingCycle>(initial?.cycle ?? "monthly");
  const [customDays, setCustomDays] = useState(initial?.customDays ? String(initial.customDays) : "30");
  const [startDate, setStartDate] = useState(initial?.startDate ?? todayIso());
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [reminderDays, setReminderDays] = useState(
    initial?.reminderDays !== undefined ? String(initial.reminderDays) : ""
  );

  const priceValid = parseFloat(price) > 0;
  const canSave = name.trim().length > 0 && priceValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      name: name.trim(),
      price: parseFloat(price),
      currency,
      cycle,
      customDays: cycle === "custom" ? Math.max(1, parseInt(customDays, 10) || 30) : undefined,
      startDate,
      notes: notes.trim() || undefined,
      reminderDays: reminderDays.trim() ? Math.max(1, parseInt(reminderDays, 10)) : undefined,
    });
  }

  return (
    <div className="form-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="sub-form" onSubmit={handleSubmit}>
        <div className="sub-form-header">
          <h2>{initial ? "Edit subscription" : "Add subscription"}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix" autoFocus />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Price</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="9.99"
            />
          </label>
          <label className="field field-narrow">
            <span>Currency</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
              {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                <option key={code} value={code}>
                  {code} ({symbol})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span>Billing cycle</span>
            <select value={cycle} onChange={(e) => setCycle(e.target.value as BillingCycle)}>
              {Object.entries(CYCLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {cycle === "custom" && (
            <label className="field field-narrow">
              <span>Every N days</span>
              <input
                type="number"
                min="1"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
              />
            </label>
          )}
        </div>

        <label className="field">
          <span>First / last payment date</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>

        <label className="field">
          <span>Remind me (days before) — optional</span>
          <input
            type="number"
            min="1"
            value={reminderDays}
            onChange={(e) => setReminderDays(e.target.value)}
            placeholder="uses default"
          />
        </label>

        <label className="field">
          <span>Notes — optional</span>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Shared with family" />
        </label>

        <div className="sub-form-actions">
          <button type="button" className="panel-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="panel-button" disabled={!canSave}>
            {initial ? "Save changes" : "Add subscription"}
          </button>
        </div>
      </form>
    </div>
  );
}
