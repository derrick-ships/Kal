"use client";
import { Plus, Trash2 } from "lucide-react";
import type { Meal } from "@/hooks/useCalorieStore";

interface Props { meal: Meal; onLog: (meal: Meal) => void; onDelete: (id: string) => void; }

export function MealCard({ meal, onLog, onDelete }: Props) {
  return (
    <div className="glass-card flex items-center justify-between px-4 py-3.5 gap-3 animate-fade-in" style={{ minHeight: 64 }}>
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-[#111827] dark:text-[#F9FAFB] truncate">{meal.name}</p>
        <p className="text-sm text-[#6B7280]">{meal.kcal} kcal</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onDelete(meal.id)}
          className="p-2 rounded-full text-[#6B7280] hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label={`Delete ${meal.name}`}>
          <Trash2 size={16} strokeWidth={2} />
        </button>
        <button onClick={() => onLog(meal)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-semibold transition-all"
          style={{ minWidth: 48, minHeight: 40 }} aria-label={`Add ${meal.name}`}>
          <Plus size={16} strokeWidth={2.5} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}