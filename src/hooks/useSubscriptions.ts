import { useCallback, useEffect, useState } from "react";
import type { Subscription } from "../types";
import { pickColor } from "../types";
import {
  hasSeededBefore,
  loadSubscriptions,
  markSeeded,
  saveSubscriptions,
} from "../lib/storage";
import { seedSubscriptions } from "../lib/seed";

export function useSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>(() => {
    const stored = loadSubscriptions();
    if (stored.length === 0 && !hasSeededBefore()) {
      markSeeded();
      return seedSubscriptions();
    }
    return stored;
  });

  useEffect(() => {
    saveSubscriptions(subs);
  }, [subs]);

  const add = useCallback((input: Omit<Subscription, "id" | "color">) => {
    const sub: Subscription = {
      ...input,
      id: crypto.randomUUID(),
      color: pickColor(input.name + Date.now()),
    };
    setSubs((prev) => [...prev, sub]);
  }, []);

  const update = useCallback((id: string, patch: Partial<Omit<Subscription, "id">>) => {
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const remove = useCallback((id: string) => {
    setSubs((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { subs, add, update, remove };
}
