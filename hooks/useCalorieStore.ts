"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

export interface Meal { id: string; name: string; kcal: number; }
export interface DayData { date: string; kcal: number; goal: number; }
interface Store { meals: Meal[]; today: DayData; }

const DEFAULT_GOAL = 2000;
const STORAGE_KEY = "calorieTracker";
const DEFAULT_MEALS: Meal[] = [
  { id: "1", name: "Oatmeal bowl", kcal: 450 },
  { id: "2", name: "Grilled chicken salad", kcal: 350 },
  { id: "3", name: "Afternoon snack", kcal: 200 },
];

function getDefaultStore(): Store {
  return { meals: DEFAULT_MEALS, today: { date: format(new Date(), "yyyy-MM-dd"), kcal: 0, goal: DEFAULT_GOAL } };
}

function loadStore(): Store {
  if (typeof window === "undefined") return getDefaultStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStore();
    const parsed: Store = JSON.parse(raw);
    const today = format(new Date(), "yyyy-MM-dd");
    if (parsed.today.date !== today) parsed.today = { date: today, kcal: 0, goal: parsed.today.goal ?? DEFAULT_GOAL };
    return parsed;
  } catch { return getDefaultStore(); }
}

function saveStore(store: Store) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { console.warn("LocalStorage save failed"); }
}

export function useCalorieStore() {
  const [store, setStore] = useState<Store>(getDefaultStore);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { const s = loadStore(); setStore(s); setLoaded(true); }, []);

  const addKcal = useCallback((kcal: number) => {
    setStore((prev) => { const next = { ...prev, today: { ...prev.today, kcal: prev.today.kcal + kcal } }; saveStore(next); return next; });
  }, []);

  const addMeal = useCallback((name: string, kcal: number) => {
    const meal: Meal = { id: Date.now().toString(), name, kcal };
    setStore((prev) => { const next = { meals: [...prev.meals, meal], today: { ...prev.today, kcal: prev.today.kcal + kcal } }; saveStore(next); return next; });
  }, []);

  const logMeal = useCallback((meal: Meal) => { addKcal(meal.kcal); }, [addKcal]);

  const setGoal = useCallback((goal: number) => {
    setStore((prev) => { const next = { ...prev, today: { ...prev.today, goal } }; saveStore(next); return next; });
  }, []);

  const resetDay = useCallback(() => {
    setStore((prev) => { const next = { ...prev, today: { ...prev.today, kcal: 0, date: format(new Date(), "yyyy-MM-dd") } }; saveStore(next); return next; });
  }, []);

  const deleteMeal = useCallback((id: string) => {
    setStore((prev) => { const next = { ...prev, meals: prev.meals.filter((m) => m.id !== id) }; saveStore(next); return next; });
  }, []);

  return { store, loaded, addMeal, logMeal, setGoal, resetDay, deleteMeal };
}