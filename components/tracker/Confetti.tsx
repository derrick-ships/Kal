"use client";
import { useEffect, useState } from "react";

const COLORS = ["#10B981", "#059669", "#34D399", "#6EE7B7", "#FBBF24", "#F59E0B"];
interface Piece { id: number; x: number; color: string; delay: number; size: number; }

export function Confetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    const p: Piece[] = Array.from({ length: 24 }, (_, i) => ({
      id: i, x: Math.random() * 100, color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.8, size: 6 + Math.random() * 6,
    }));
    setPieces(p);
    const t = setTimeout(() => setPieces([]), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!pieces.length) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {pieces.map((p) => (
        <div key={p.id} className="absolute top-0 rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color,
            animation: `confetti 1.8s ease-in ${p.delay}s forwards` }} />
      ))}
    </div>
  );
}