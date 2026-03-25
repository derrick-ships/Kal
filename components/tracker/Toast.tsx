"use client";
import { useEffect } from "react";

interface Props { message: string; onDone: () => void; }

export function Toast({ message, onDone }: Props) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 animate-toast pointer-events-none">
      <div className="glass-card px-5 py-3 flex items-center gap-2 whitespace-nowrap">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]">{message}</span>
      </div>
    </div>
  );
}