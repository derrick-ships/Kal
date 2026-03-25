"use client";
import { Plus, Trash2 } from "lucide-react";
import type { Meal } from "@/hooks/useCalorieStore";

interface Props { meal: Meal; onLog: (m: Meal) => void; onDelete: (id: string) => void; }

export function MealCard({ meal, onLog, onDelete }: Props) {
  return (
    <div className="meal-item anim-fade-up" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
      {/* Color dot */}
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green-glow)", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {meal.name}
        </p>
        <p style={{ fontSize: 12, color: "var(--green)", fontFamily: "var(--font-display)", marginTop: 2 }}>
          {meal.kcal} kcal
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button onClick={() => onDelete(meal.id)} style={{
          width: 30, height: 30, borderRadius: "50%", border: "none",
          background: "transparent", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", color: "var(--fg3)",
          transition: "color 0.15s",
        }}
          onTouchStart={e => (e.currentTarget.style.color = "var(--red)")}
          onTouchEnd={e => (e.currentTarget.style.color = "var(--fg3)")}>
          <Trash2 size={13} strokeWidth={2} />
        </button>
        <button onClick={() => onLog(meal)} className="btn-primary" style={{
          display: "flex", alignItems: "center", gap: 5, padding: "0 12px",
          height: 34, fontSize: 12,
        }}>
          <Plus size={13} strokeWidth={2.5} />
          Add
        </button>
      </div>
    </div>
  );
}