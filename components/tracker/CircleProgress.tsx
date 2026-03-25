"use client";
import { useEffect, useRef } from "react";

interface Props { current: number; goal: number; size?: number; }

export function CircleProgress({ current, goal, size = 160 }: Props) {
  const progressRef = useRef<SVGCircleElement>(null);
  const sw = 10;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(current / Math.max(goal, 1), 1);
  const offset = circ * (1 - pct);
  const isHit = current >= goal && goal > 0;

  useEffect(() => {
    if (!progressRef.current) return;
    progressRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)";
    progressRef.current.style.strokeDashoffset = String(offset);
  }, [offset]);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {pct > 0 && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(16,185,129,${pct * 0.18}) 0%, transparent 70%)`,
          transition: "background 1s ease",
        }} />
      )}
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
        <circle ref={progressRef} cx={size/2} cy={size/2} r={r} fill="none"
          stroke={isHit ? "#10B981" : "url(#emerald)"}
          strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ}
          style={{ filter: pct > 0 ? "drop-shadow(0 0 8px rgba(16,185,129,0.7))" : "none" }}
        />
        <defs>
          <linearGradient id="emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}