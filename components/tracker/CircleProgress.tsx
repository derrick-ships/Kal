"use client";
import { useEffect, useRef } from "react";

interface Props { current: number; goal: number; size?: number; }

export function CircleProgress({ current, goal, size = 160 }: Props) {
  const progressRef = useRef<SVGCircleElement>(null);
  const sw = 6;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(current / Math.max(goal, 1), 1);
  const offset = circ * (1 - pct);

  useEffect(() => {
    if (!progressRef.current) return;
    progressRef.current.style.transition = "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)";
    progressRef.current.style.strokeDashoffset = String(offset);
  }, [offset]);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth={sw} />
        <circle ref={progressRef} cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#30D158"
          strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ}
        />
      </svg>
    </div>
  );
}
