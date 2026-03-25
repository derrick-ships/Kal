"use client";
import { Plus, Trash2 } from "lucide-react";
import type { Meal } from "@/hooks/useCalorieStore";

interface Props { meal: Meal; onLog: (m: Meal) => void; onDelete: (id: string) => void; isLast?: boolean; }

export function MealCard({ meal, onLog, onDelete, isLast = false }: Props) {
  return (
    <div
      className="anim-fade-up"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 28px",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        transition: "background 0.2s",
      }}
      onTouchStart={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(196,164,124,0.03)"; }}
      onTouchEnd={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
    >
      {/* Timeline dot */}
      <div style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "var(--border2)",
        flexShrink: 0,
      }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 15,
          fontWeight: 300,
          color: "var(--fg)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          letterSpacing: "0.01em",
        }}>
          {meal.name}
        </p>
        <p style={{
          fontSize: 11,
          fontWeight: 400,
          color: "var(--accent)",
          marginTop: 2,
          letterSpacing: "0.06em",
        }}>
          {meal.kcal} kcal
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => { onDelete(meal.id); if (navigator.vibrate) navigator.vibrate(20); }}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--fg3)",
            transition: "color 0.2s",
          }}
          onTouchStart={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--red)"; }}
          onTouchEnd={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--fg3)"; }}
        >
          <Trash2 size={13} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => { onLog(meal); if (navigator.vibrate) navigator.vibrate([25, 10, 40]); }}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid var(--border2)",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
          onTouchStart={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--bg)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
          }}
          onTouchEnd={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border2)";
          }}
        >
          <Plus size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
