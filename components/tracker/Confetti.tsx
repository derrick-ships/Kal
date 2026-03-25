"use client";
import { useEffect, useState } from "react";

const COLORS = ["#10B981","#34d399","#6ee7b7","#059669","#fbbf24","#f59e0b","#34d399"];
interface Piece { id: number; x: number; color: string; delay: number; size: number; round: boolean; }

export function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  useEffect(() => {
    const p = Array.from({ length: 32 }, (_, i) => ({
      id: i, x: Math.random() * 100, color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.7, size: 4 + Math.random() * 8,
      round: Math.random() > 0.5,
    }));
    setPieces(p);
    const t = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!pieces.length) return null;
  return (
    <div className="overlay-portal" style={{ pointerEvents: "none", overflow: "hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: 0, left: `${p.x}%`,
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: p.round ? "50%" : 2,
          animation: `confetti 2.2s ease-in ${p.delay}s forwards`,
          boxShadow: `0 0 6px ${p.color}88`,
        }} />
      ))}
    </div>
  );
}