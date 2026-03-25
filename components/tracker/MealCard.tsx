"use client";
import { Plus, Trash2 } from "lucide-react";
import type { Meal } from "@/hooks/useCalorieStore";

interface Props { meal: Meal; onLog: (m: Meal) => void; onDelete: (id: string) => void; isLast?: boolean; }

export function MealCard({ meal, onLog, onDelete, isLast = false }: Props) {
  return (
    <div
      className="anim-fade-up"
      style={{
        display: "flex", alignItems: "center", gap: 12,
        height: 56, padding: "0 16px",
        borderBottom: isLast ? "none" : "1px solid rgba(235,235,245,0.1)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 17, fontWeight: 400, color: "var(--fg)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {meal.name}
        </p>
        <p style={{ fontSize: 17, fontWeight: 600, color: "var(--fg)", marginTop: 0 }}>
          {meal.kcal} kcal
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button
          onClick={() => onDelete(meal.id)}
          style={{
            width: 30, height: 30, borderRadius: "50%", border: "none",
            background: "transparent", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: "var(--fg3)",
            transition: "color 0.15s",
          }}
          onTouchStart={e => (e.currentTarget.style.color = "var(--red)")}
          onTouchEnd={e => (e.currentTarget.style.color = "var(--fg3)")}
        >
          <Trash2 size={15} strokeWidth={2} />
        </button>
        <button
          onClick={() => onLog(meal)}
          style={{
            width: 28, height: 28, borderRadius: "50%", border: "none",
            background: "var(--green)", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
          onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)"; }}
          onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          <Plus size={14} strokeWidth={2.5} color="#000" />
        </button>
      </div>
    </div>
  );
}
