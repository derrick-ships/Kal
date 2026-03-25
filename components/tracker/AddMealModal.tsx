"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface Props { open: boolean; onClose: () => void; onSave: (name: string, kcal: number) => void; }

export function AddMealModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) { setError("Enter a meal name."); return; }
    const k = parseInt(kcal);
    if (!k || k <= 0) { setError("Enter valid calories."); return; }
    onSave(name.trim(), k);
    setName(""); setKcal(""); setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glass-card w-full max-w-[480px] p-6 rounded-t-3xl rounded-b-none animate-slide-up"
        style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#111827] dark:text-[#F9FAFB]">Log New Meal</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-2">Meal name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Oatmeal bowl"
              className="w-full h-12 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-base font-medium text-[#111827] dark:text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-2">Calories (kcal)</label>
            <input type="number" value={kcal} onChange={(e) => setKcal(e.target.value)} placeholder="450"
              inputMode="numeric"
              className="w-full h-12 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-base font-medium text-[#111827] dark:text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <button onClick={handleSubmit}
          className="mt-6 w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-base font-semibold transition-all">
          Save & Add
        </button>
      </div>
    </div>
  );
}