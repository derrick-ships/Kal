"use client";
import { useState, useCallback, useRef } from "react";
import { format } from "date-fns";
import { Plus, Flame, RotateCcw, Target, Wind } from "lucide-react";
import { useCalorieStore } from "@/hooks/useCalorieStore";
import { useSwipe } from "@/hooks/useSwipe";
import { CircleProgress } from "@/components/tracker/CircleProgress";
import { MealCard } from "@/components/tracker/MealCard";
import { AddMealModal } from "@/components/tracker/AddMealModal";
import { UrgeOverlay } from "@/components/tracker/UrgeOverlay";
import { Toast } from "@/components/tracker/Toast";
import { SkeletonList } from "@/components/tracker/SkeletonList";
import { Confetti } from "@/components/tracker/Confetti";

export default function Home() {
  const { store, loaded, addMeal, logMeal, setGoal, resetDay, deleteMeal } = useCalorieStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [urgeOpen, setUrgeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const prevKcal = useRef(0);

  const triggerUrge = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 160]);
    setUrgeOpen(true);
  }, []);

  const { onTouchStart, onTouchEnd } = useSwipe(triggerUrge);

  const handleLog = useCallback((meal: typeof store.meals[0]) => {
    const prevTotal = store.today.kcal;
    logMeal(meal);
    if (navigator.vibrate) navigator.vibrate(60);
    setToast(`Logged! +${meal.kcal} kcal`);
    if (prevTotal < store.today.goal && prevTotal + meal.kcal >= store.today.goal) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [store, logMeal]);

  const handleAddMeal = useCallback((name: string, kcal: number) => {
    addMeal(name, kcal);
    if (navigator.vibrate) navigator.vibrate(60);
    setToast(`Saved & logged! +${kcal} kcal`);
  }, [addMeal]);

  const handleGoalSave = useCallback(() => {
    const g = parseInt(goalInput);
    if (g && g > 0) { setGoal(g); setGoalInput(""); }
    setEditingGoal(false);
  }, [goalInput, setGoal]);

  const handleReset = useCallback(() => {
    if (!confirmReset) { setConfirmReset(true); setTimeout(() => setConfirmReset(false), 3000); return; }
    resetDay();
    setConfirmReset(false);
    setToast("Day reset.");
  }, [confirmReset, resetDay]);

  const pct = Math.round((store.today.kcal / Math.max(store.today.goal, 1)) * 100);
  const remaining = Math.max(store.today.goal - store.today.kcal, 0);
  const isGoalHit = store.today.kcal >= store.today.goal && store.today.goal > 0;

  return (
    <main
      className="flex flex-col min-h-dvh bg-[#FAFAFA] dark:bg-[#0F0F0F] select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {urgeOpen && <UrgeOverlay onDone={() => setUrgeOpen(false)} />}
      {showConfetti && <Confetti />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      <AddMealModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAddMeal} />

      <header className="sticky top-0 z-20 px-6 pt-12 pb-6 bg-[#FAFAFA]/90 dark:bg-[#0F0F0F]/90"
        style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-5">
          <CircleProgress current={store.today.kcal} goal={store.today.goal} size={96} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[40px] font-bold leading-none text-[#111827] dark:text-[#F9FAFB] tabular-nums">
                {store.today.kcal.toLocaleString()}
              </span>
              <span className="text-lg font-medium text-[#6B7280]">kcal</span>
            </div>
            <p className="text-sm text-[#6B7280] mt-1 font-medium">
              {isGoalHit ? "🎯 Goal reached!" : `${remaining.toLocaleString()} kcal remaining`}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{format(new Date(), "EEEE, MMM d")}</p>
          </div>
        </div>
        <div className="mt-4 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(pct, 100)}%`, background: isGoalHit ? "#10B981" : "linear-gradient(90deg, #059669, #10B981)" }} />
        </div>
      </header>

      <section className="flex-1 px-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#111827] dark:text-[#F9FAFB]">Saved Meals</h2>
          <span className="text-xs text-[#9CA3AF] font-medium">{store.meals.length} items</span>
        </div>
        {!loaded ? <SkeletonList /> : store.meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
              <Flame size={24} className="text-emerald-500" strokeWidth={2} />
            </div>
            <p className="text-[#6B7280] font-medium">Your favorites will appear here.</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Log one to start.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {store.meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onLog={handleLog} onDelete={deleteMeal} />
            ))}
          </div>
        )}
        <div className="mt-8 flex items-center justify-center gap-2 py-3 rounded-2xl bg-black/5 dark:bg-white/5">
          <Wind size={14} className="text-[#9CA3AF]" strokeWidth={2} />
          <p className="text-xs text-[#9CA3AF] font-medium">Swipe right → 90s urge interrupt</p>
        </div>
      </section>

      <footer className="sticky bottom-0 z-20 px-6 pt-4 bg-[#FAFAFA]/90 dark:bg-[#0F0F0F]/90 border-t border-black/5 dark:border-white/5"
        style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
        <div className="flex items-center gap-3">
          <div className="flex-1 glass-card px-4 py-3 flex items-center gap-3">
            <Target size={16} className="text-emerald-500 shrink-0" strokeWidth={2} />
            {editingGoal ? (
              <input type="number" value={goalInput} onChange={(e) => setGoalInput(e.target.value)}
                placeholder={String(store.today.goal)} inputMode="numeric" autoFocus
                onBlur={handleGoalSave} onKeyDown={(e) => e.key === "Enter" && handleGoalSave()}
                className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-[#111827] dark:text-[#F9FAFB] focus:outline-none" />
            ) : (
              <button className="flex-1 text-left" onClick={() => { setEditingGoal(true); setGoalInput(String(store.today.goal)); }}>
                <span className="text-sm font-semibold text-[#111827] dark:text-[#F9FAFB]">{store.today.goal.toLocaleString()} kcal goal</span>
              </button>
            )}
          </div>
          <button onClick={handleReset} className="glass-card px-4 py-3 flex items-center gap-2 transition-all active:scale-95" style={{ minHeight: 48 }}>
            <RotateCcw size={16} className="text-[#6B7280]" strokeWidth={2} />
            <span className="text-sm font-medium text-[#6B7280]">{confirmReset ? "Sure?" : "Reset"}</span>
          </button>
        </div>
      </footer>

      <button onClick={() => setModalOpen(true)}
        className="fixed right-6 z-30 w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-90 flex items-center justify-center transition-all"
        style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))", boxShadow: "0 4px 20px rgba(16,185,129,0.4)" }}
        aria-label="Add new meal">
        <Plus size={28} strokeWidth={2.5} className="text-white" />
      </button>
    </main>
  );
}