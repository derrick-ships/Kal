"use client";
import { useEffect, useState } from "react";

interface Props { current: number; goal: number; size?: number; }

export function CircleProgress({ current, goal, size = 120 }: Props) {
  const [animated, setAnimated] = useState(0);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(current / Math.max(goal, 1), 1);
  const offset = circumference - animated * circumference;
  const isGoalHit = current >= goal && goal > 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor"
          strokeWidth={strokeWidth} className="text-black/10 dark:text-white/10" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="url(#emeraldGrad)"
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }} />
        <defs>
          <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      {isGoalHit && (
        <div className="absolute inset-0 rounded-full border-4 border-emerald-400/50"
          style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
      )}
    </div>
  );
}