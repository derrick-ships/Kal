"use client";
import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Plus, Flame, RotateCcw, Wind } from "lucide-react";
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
  const [confetti, setConfetti] = useState(false);
  const [editGoal, setEditGoal] = useState(false);
  const [goalVal, setGoalVal] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [kcalKey, setKcalKey] = useState(0);

  const triggerUrge = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 150]);
    setUrgeOpen(true);
  }, []);

  const { onTouchStart, onTouchEnd } = useSwipe(triggerUrge);

  const handleLog = useCallback((meal: typeof store.meals[0]) => {
    const prev = store.today.kcal;
    logMeal(meal);
    if (navigator.vibrate) navigator.vibrate(50);
    setToast(`+${meal.kcal} kcal`);
    setKcalKey(k => k + 1);
    if (prev < store.today.goal && prev + meal.kcal >= store.today.goal) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  }, [store, logMeal]);

  const handleAdd = useCallback((name: string, kcal: number) => {
    addMeal(name, kcal);
    if (navigator.vibrate) navigator.vibrate(50);
    setToast(`${name} · +${kcal} kcal`);
    setKcalKey(k => k + 1);
  }, [addMeal]);

  const handleGoalSave = useCallback(() => {
    const g = parseInt(goalVal);
    if (g > 0) setGoal(g);
    setEditGoal(false);
    setGoalVal("");
  }, [goalVal, setGoal]);

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    resetDay();
    setConfirmReset(false);
    setToast("Day reset");
    setKcalKey(k => k + 1);
  }, [confirmReset, resetDay]);

  const pct = Math.round((store.today.kcal / Math.max(store.today.goal, 1)) * 100);
  const remaining = Math.max(store.today.goal - store.today.kcal, 0);
  const isHit = store.today.kcal >= store.today.goal && store.today.goal > 0;

  return (
    <div
      style={{ position: "relative", zIndex: 1, minHeight: "100dvh", display: "flex", flexDirection: "column" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {urgeOpen && <UrgeOverlay onDone={() => setUrgeOpen(false)} />}
      {confetti && <Confetti />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      <AddMealModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAdd} />

      {/* ── HEADER ── */}
      <header style={{
        padding: "56px 20px 20px",
        paddingTop: "max(56px, calc(env(safe-area-inset-top) + 16px))",
        position: "sticky", top: 0, zIndex: 20,
        background: "#000000",
      }}>
        {/* App title */}
        <h1 style={{
          fontSize: 34, fontWeight: 700,
          color: "var(--fg)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          fontFamily: "var(--font-display)",
        }}>
          KalTrak
        </h1>

        {/* Date subtitle */}
        <p style={{
          fontSize: 15, color: "var(--fg2)",
          marginTop: 2, marginBottom: 20,
        }}>
          {format(new Date(), "EEEE, MMM d")}
        </p>

        {/* Ring + numbers row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Ring with % inside */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <CircleProgress current={store.today.kcal} goal={store.today.goal} size={84} />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 13, fontWeight: 600,
                color: "var(--fg)",
              }}>
                {pct}%
              </span>
            </div>
          </div>

          {/* Calorie numbers */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              key={kcalKey}
              className="anim-num"
              style={{ display: "flex", alignItems: "baseline", gap: 5 }}
            >
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 34, fontWeight: 700,
                color: "var(--fg)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}>
                {store.today.kcal.toLocaleString()}
              </span>
              <span style={{ fontSize: 15, color: "var(--fg2)", fontWeight: 400, paddingBottom: 2 }}>
                kcal
              </span>
            </div>

            <p style={{
              fontSize: 15, marginTop: 4, fontWeight: 400,
              color: "var(--fg2)",
            }}>
              {isHit ? "Goal reached" : `${remaining.toLocaleString()} remaining`}
            </p>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <section style={{ flex: 1, padding: "20px 16px 0" }}>

        {/* Meals card */}
        <div style={{
          background: "var(--card)",
          borderRadius: 12,
          overflow: "hidden",
        }}>
          {/* Section header inside card */}
          <div style={{ padding: "16px 16px 8px" }}>
            <span style={{
              fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--fg3)",
            }}>
              Saved Meals
              {store.meals.length > 0 && (
                <span style={{ marginLeft: 8, fontWeight: 400 }}>
                  {store.meals.length}
                </span>
              )}
            </span>
          </div>

          {/* List */}
          {!loaded ? <SkeletonList /> : store.meals.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "40px 24px", gap: 10, textAlign: "center",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(48,209,88,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Flame size={20} color="var(--green)" strokeWidth={1.5} />
              </div>
              <p style={{ color: "var(--fg2)", fontSize: 15, fontWeight: 400 }}>
                Your favorites will appear here.
              </p>
              <p style={{ color: "var(--fg3)", fontSize: 13 }}>Tap + to log your first meal.</p>
            </div>
          ) : (
            <div>
              {store.meals.map((meal, i) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onLog={handleLog}
                  onDelete={deleteMeal}
                  isLast={i === store.meals.length - 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Urge trigger hint */}
        <button
          onClick={triggerUrge}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, width: "100%", marginTop: 16,
            padding: "11px 16px",
            background: "transparent",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 12, cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onTouchStart={e => { e.currentTarget.style.borderColor = "rgba(255,69,58,0.25)"; e.currentTarget.style.background = "rgba(255,69,58,0.03)"; }}
          onTouchEnd={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "transparent"; }}
        >
          <Wind size={13} color="var(--fg3)" strokeWidth={2} />
          <span style={{ fontSize: 11, color: "var(--fg3)", fontWeight: 500, letterSpacing: "0.02em" }}>
            Swipe right or tap — 90s urge interrupt
          </span>
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "sticky", bottom: 0, zIndex: 20,
        padding: "12px 16px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        background: "#000000",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        {/* Goal — plain text, tap to edit */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editGoal ? (
            <input
              autoFocus
              type="number" inputMode="numeric"
              value={goalVal}
              onChange={e => setGoalVal(e.target.value)}
              onBlur={handleGoalSave}
              onKeyDown={e => e.key === "Enter" && handleGoalSave()}
              placeholder={String(store.today.goal)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "var(--fg)", fontSize: 15, fontWeight: 400,
                fontFamily: "var(--font-body)", width: "100%",
              }}
            />
          ) : (
            <button
              onClick={() => { setEditGoal(true); setGoalVal(String(store.today.goal)); }}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--fg2)", fontSize: 15, fontWeight: 400,
                fontFamily: "var(--font-body)", padding: 0,
                whiteSpace: "nowrap",
              }}
            >
              {store.today.goal.toLocaleString()} kcal goal
            </button>
          )}
        </div>

        {/* Reset — text-only, red */}
        <button
          onClick={handleReset}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: confirmReset ? "var(--red)" : "var(--fg3)",
            fontSize: 15, fontWeight: 400,
            fontFamily: "var(--font-body)",
            display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
            padding: "0 4px",
            transition: "color 0.2s",
          }}
        >
          <RotateCcw size={14} strokeWidth={2} />
          {confirmReset ? "Sure?" : "Reset"}
        </button>

        {/* FAB */}
        <button
          onClick={() => setModalOpen(true)}
          className="fab"
          aria-label="Add meal"
          style={{ flexShrink: 0 }}
        >
          <Plus size={22} strokeWidth={2.5} color="#000" />
        </button>
      </footer>
    </div>
  );
}
