import { useState } from "react";
import { useSubscriptions } from "./hooks/useSubscriptions";
import { SummaryBar } from "./components/SummaryBar";
import { ReminderBanner } from "./components/ReminderBanner";
import { SubscriptionList } from "./components/SubscriptionList";
import { SubscriptionForm } from "./components/SubscriptionForm";
import { UpcomingCalendar } from "./components/UpcomingCalendar";
import type { Subscription } from "./types";
import { loadReminderDays, saveReminderDays } from "./lib/storage";
import "./styles.css";

export default function App() {
  const { subs, add, update, remove } = useSubscriptions();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [reminderDays, setReminderDays] = useState(loadReminderDays);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(sub: Subscription) {
    setEditing(sub);
    setFormOpen(true);
  }
  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }
  function handleSave(input: Omit<Subscription, "id" | "color">) {
    if (editing) update(editing.id, input);
    else add(input);
    closeForm();
  }
  function handleReminderChange(value: number) {
    setReminderDays(value);
    saveReminderDays(value);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Subscriptions</h1>
        <button type="button" className="panel-button" onClick={openAdd}>
          + Add subscription
        </button>
      </header>

      <SummaryBar subs={subs} />
      <ReminderBanner subs={subs} reminderDays={reminderDays} />

      <div className="app-columns">
        <section className="app-column-main">
          <div className="section-heading">
            <h2>All subscriptions</h2>
            <label className="reminder-setting">
              Remind me
              <input
                type="number"
                min={1}
                value={reminderDays}
                onChange={(e) => handleReminderChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
              days before
            </label>
          </div>
          <SubscriptionList subs={subs} onEdit={openEdit} onDelete={remove} reminderDays={reminderDays} />
        </section>

        <aside className="app-column-side">
          <UpcomingCalendar subs={subs} />
        </aside>
      </div>

      {formOpen && (
        <SubscriptionForm initial={editing ?? undefined} onSave={handleSave} onClose={closeForm} />
      )}
    </div>
  );
}
