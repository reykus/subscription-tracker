import { pickColor, type Subscription } from "../types";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function seedSubscriptions(): Subscription[] {
  const specs: Omit<Subscription, "id" | "color">[] = [
    { name: "Netflix", price: 15.49, currency: "USD", cycle: "monthly", startDate: isoDaysAgo(12) },
    { name: "Spotify", price: 10.99, currency: "USD", cycle: "monthly", startDate: isoDaysAgo(3) },
    { name: "Domain renewal", price: 12, currency: "EUR", cycle: "yearly", startDate: isoDaysAgo(300) },
    { name: "Gym", price: 349, currency: "SEK", cycle: "monthly", startDate: isoDaysAgo(20) },
  ];

  return specs.map((s, i) => ({
    ...s,
    id: `seed-${i}`,
    color: pickColor(s.name),
  }));
}
