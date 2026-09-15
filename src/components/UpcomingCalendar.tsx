import { useMemo, useState } from "react";
import type { Subscription } from "../types";
import { occurrencesInRange } from "../lib/dates";
import { formatMoney } from "../lib/currency";

type Props = {
  subs: Subscription[];
};

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function UpcomingCalendar({ subs }: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selected, setSelected] = useState<Date | null>(null);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const { cells, eventsByDay } = useMemo(() => {
    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const leadingBlanks = (monthStart.getDay() + 6) % 7; // week starts Monday

    const byDay = new Map<string, { sub: Subscription; date: Date }[]>();
    for (const sub of subs) {
      for (const date of occurrencesInRange(sub, monthStart, monthEnd)) {
        const key = date.toDateString();
        const list = byDay.get(key) ?? [];
        list.push({ sub, date });
        byDay.set(key, list);
      }
    }

    const dayCells: (Date | null)[] = Array(leadingBlanks).fill(null);
    for (let d = 1; d <= monthEnd.getDate(); d++) {
      dayCells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    }

    return { cells: dayCells, eventsByDay: byDay };
  }, [cursor, subs]);

  const today = new Date();
  const selectedEvents = selected ? eventsByDay.get(selected.toDateString()) ?? [] : [];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="icon-button"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="calendar-title">{monthLabel}</span>
        <button
          type="button"
          className="icon-button"
          onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="calendar-grid calendar-weekdays">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((date, i) => {
          if (!date) return <span key={`blank-${i}`} className="calendar-cell calendar-cell-blank" />;
          const events = eventsByDay.get(date.toDateString()) ?? [];
          const isToday = sameDay(date, today);
          const isSelected = selected && sameDay(date, selected);
          return (
            <button
              type="button"
              key={date.toISOString()}
              className={`calendar-cell ${isToday ? "calendar-cell-today" : ""} ${
                isSelected ? "calendar-cell-selected" : ""
              }`}
              onClick={() => setSelected(events.length ? date : null)}
            >
              <span>{date.getDate()}</span>
              {events.length > 0 && (
                <span className="calendar-dots">
                  {events.slice(0, 4).map((ev, idx) => (
                    <span key={idx} className="calendar-dot" style={{ background: ev.sub.color }} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedEvents.length > 0 && (
        <div className="calendar-day-detail">
          <p className="hint">{selected?.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
          <ul>
            {selectedEvents.map(({ sub }) => (
              <li key={sub.id}>
                <span className="sub-dot" style={{ background: sub.color }} />
                {sub.name} — {formatMoney(sub.price, sub.currency)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
