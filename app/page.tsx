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
        position: "sticky", top: 0, zIndex: 20,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        backgroundColor: "rgba(8,8,8,0.88)",
        borderBottom: "1px solid var(--border)",
        background: "linear-gradient(180deg, rgba(16,185,129,0.04) 0%, rgba(8,8,8,0.88) 100%)",
      }}>
        {/* Row: ring + numbers */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* Ring with % inside */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <CircleProgress current={store.today.kcal} goal={store.today.goal} size={84} />
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 12, fontWeight: 500,
                color: isHit ? "var(--green)" : "var(--fg3)",
                letterSpacing: "-0.02em",
              }}>
                {pct}%
              </span>
            </div>
          </div>

          {/* Calorie number */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              key={kcalKey}
              className="anim-num"
              style={{ display: "flex", alignItems: "baseline", gap: 5 }}
            >
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 48, fontWeight: 500,
                color: "var(--fg)",
                letterSpacing: "-0.05em",
                lineHeight: 1,
              }}>
                {store.today.kcal.toLocaleString()}
              </span>
              <span style={{ fontSize: 13, color: "var(--fg3)", fontWeight: 400, paddingBottom: 3 }}>
                kcal
              </span>
            </div>

            <p style={{
              fontSize: 12, marginTop: 5, fontWeight: 500,
              color: isHit ? "var(--green)" : "var(--fg2)",
            }}>
              {isHit ? "🎯 Goal reached" : `${remaining.toLocaleString()} to go`}
            </p>
            <p style={{ fontSize: 11, color: "var(--fg3)", marginTop: 2 }}>
              {format(new Date(), "EEEE, MMM d")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: 16, height: 2, borderRadius: 1,
          background: "rgba(255,255,255,0.05)", overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${Math.min(pct, 100)}%`,
            borderRadius: 1,
            background: isHit ? "var(--green)" : "linear-gradient(90deg, #059669, #34d399)",
            boxShadow: pct > 0 ? "0 0 10px rgba(16,185,129,0.6)" : "none",
            transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
          }} />
        </div>
      </header>

      {/* ── BODY ── */}
      <section style={{ flex: 1, padding: "20px 16px 0" }}>

        {/* Section label */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12, padding: "0 2px",
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "var(--fg3)",
            fontFamily: "var(--font-display)",
          }}>
            Saved meals
          </span>
          <span style={{ fontSize: 11, color: "var(--fg3)", fontFamily: "var(--font-display)" }}>
            {store.meals.length}
          </span>
        </div>

        {/* List */}
        {!loaded ? <SkeletonList /> : store.meals.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "52px 24px", gap: 12, textAlign: "center",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "var(--green-dim)",
              border: "1px solid rgba(16,185,129,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Flame size={20} color="var(--green)" strokeWidth={1.5} />
            </div>
            <p style={{ color: "var(--fg2)", fontSize: 14, fontWeight: 500 }}>
              Your favorites will appear here.
            </p>
            <p style={{ color: "var(--fg3)", fontSize: 13 }}>Tap + to log your first meal.</p>
          </div>
        ) : (
          <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {store.meals.map(meal => (
              <MealCard key={meal.id} meal={meal} onLog={handleLog} onDelete={deleteMeal} />
            ))}
          </div>
        )}

        {/* Urge trigger hint */}
        <button
          onClick={triggerUrge}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, width: "100%", marginTop: 20,
            padding: "11px 16px",
            background: "transparent",
            border: "1px dashed rgba(255,255,255,0.08)",
            borderRadius: 14, cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onTouchStart={e => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; e.currentTarget.style.background = "rgba(239,68,68,0.03)"; }}
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
        backgroundColor: "rgba(8,8,8,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--border)",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        {/* Goal pill */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 10,
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 14, padding: "10px 14px",
          minWidth: 0,
        }}>
          <Target size={14} color="var(--green)" strokeWidth={2} style={{ flexShrink: 0 }} />
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
                flex: 1, minWidth: 0,
                background: "transparent", border: "none", outline: "none",
                color: "var(--fg)", fontSize: 13, fontWeight: 600,
                fontFamily: "var(--font-body)",
              }}
            />
          ) : (
            <button
              onClick={() => { setEditGoal(true); setGoalVal(String(store.today.goal)); }}
              style={{
                flex: 1, textAlign: "left",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--fg)", fontSize: 13, fontWeight: 600,
                fontFamily: "var(--font-body)", padding: 0,
                whiteSpace: "nowrap", overflow: "hidden",
              }}
            >
              {store.today.goal.toLocaleString()} kcal
            </button>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="btn-ghost"
          style={{
            height: 44, padding: "0 14px", fontSize: 12,
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
            color: confirmReset ? "var(--red)" : "var(--fg3)",
            borderColor: confirmReset ? "rgba(239,68,68,0.3)" : "var(--border)",
            transition: "all 0.2s",
          }}
        >
          <RotateCcw size={13} strokeWidth={2} />
          {confirmReset ? "Sure?" : "Reset"}
        </button>

        {/* FAB */}
        <button
          onClick={() => setModalOpen(true)}
          className="fab"
          aria-label="Add meal"
          style={{ flexShrink: 0 }}
        >
          <Plus size={24} strokeWidth={2.5} color="#000" />
        </button>
      </footer>
    </div>
  );
}