"use client";
import { useEffect } from "react";

interface Props { message: string; onDone: () => void; }

export function Toast({ message, onDone }: Props) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="overlay-portal anim-toast" style={{
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      paddingBottom: "calc(110px + env(safe-area-inset-bottom))",
      pointerEvents: "none",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 18px",
        background: "var(--surface2)",
        border: "1px solid var(--border2)",
        borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)", flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>
          {message}
        </span>
      </div>
    </div>
  );
}