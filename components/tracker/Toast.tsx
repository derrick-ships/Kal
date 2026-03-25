"use client";
import { useEffect } from "react";

interface Props { message: string; onDone: () => void; }

export function Toast({ message, onDone }: Props) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div
      className="overlay-portal anim-toast"
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "calc(100px + env(safe-area-inset-bottom))",
        pointerEvents: "none",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "11px 18px",
        background: "var(--surface2)",
        border: "1px solid var(--border2)",
        borderRadius: 2,
      }}>
        <div style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "var(--accent)",
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 12,
          fontWeight: 400,
          color: "var(--fg2)",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-body)",
          letterSpacing: "0.03em",
        }}>
          {message}
        </span>
      </div>
    </div>
  );
}
