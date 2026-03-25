"use client";
import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Plus, RotateCcw, Wind } from "lucide-react";
import { useCalorieStore } from "@/hooks/useCalorieStore";
import { useSwipe } from "@/hooks/useSwipe";
import { FluidProgress } from "@/components/tracker/FluidProgress";
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
    if (navigator.vibrate) navigator.vibrate([60, 30, 80]);
    setUrgeOpen(true);
  }, []);

  const { onTouchStart, onTouchEnd } = useSwipe(triggerUrge);

  const handleLog = useCallback((meal: typeof store.meals[0]) => {
    const prev = store.today.kcal;
    logMeal(meal);
    if (navigator.vibrate) navigator.vibrate([30, 15, 50]);
    setToast(`${meal.name} · ${meal.kcal} kcal`);
    setKcalKey(k => k + 1);
    if (prev < store.today.goal && prev + meal.kcal >= store.today.goal) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
  }, [store, logMeal]);

  const handleAdd = useCallback((name: string, kcal: number) => {
    addMeal(name, kcal);
    if (navigator.vibrate) navigator.vibrate([30, 15, 50]);
    setToast(`${name} saved`);
    setKcalKey(k => k + 1);
  }, [addMeal]);

  const handleGoalSave = useCallback(() => {
    const g = parseInt(goalVal);
    if (g > 0) { setGoal(g); if (navigator.vibrate) navigator.vibrate(25); }
    setEditGoal(false);
    setGoalVal("");
  }, [goalVal, setGoal]);

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true);
      if (navigator.vibrate) navigator.vibrate(25);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    resetDay();
    setConfirmReset(false);
    setToast("Day reset");
    if (navigator.vibrate) navigator.vibrate([25, 15, 40]);
    setKcalKey(k => k + 1);
  }, [confirmReset, resetDay]);

  const pct = Math.min(store.today.kcal / Math.max(store.today.goal, 1), 1);
  const remaining = Math.max(store.today.goal - store.today.kcal, 0);
  const isHit = store.today.kcal >= store.today.goal && store.today.goal > 0;

  return (
    <>
      {/* Urge overlay lives outside the blurred container */}
      {urgeOpen && <UrgeOverlay onDone={() => setUrgeOpen(false)} />}

      {confetti && <Confetti />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      <AddMealModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAdd} />

      {/* Main screen — dims + scales away when urge overlay opens */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.55s ease, filter 0.55s ease",
          transform: urgeOpen ? "scale(0.92)" : "scale(1)",
          opacity: urgeOpen ? 0.3 : 1,
          filter: urgeOpen ? "blur(4px)" : "none",
          transformOrigin: "50% 40%",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* ── HEADER ── */}
        <header style={{
          padding: "0 28px 0",
          paddingTop: "max(52px, calc(env(safe-area-inset-top) + 20px))",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <h1 style={{
              fontSize: 26,
              fontWeight: 300,
              color: "var(--fg)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              Kal
            </h1>
            <span style={{
              fontSize: 10,
              color: "var(--fg3)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              {format(new Date(), "EEE, MMM d")}
            </span>
          </div>
        </header>

        {/* ── ORB + NUMBERS ── */}
        <section style={{
          padding: "36px 28px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <FluidProgress pct={pct} size={180} />

          <div
            key={kcalKey}
            className="anim-num"
            style={{ marginTop: 28, textAlign: "center" }}
          >
            <div style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 7,
            }}>
              <span style={{
                fontSize: 68,
                fontWeight: 200,
                color: "var(--fg)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}>
                {store.today.kcal.toLocaleString()}
              </span>
              <span style={{
                fontSize: 14,
                color: "var(--fg3)",
                fontWeight: 300,
                paddingBottom: 6,
                letterSpacing: "0.04em",
              }}>
                kcal
              </span>
            </div>

            <p style={{
              fontSize: 11,
              marginTop: 9,
              fontWeight: 400,
              color: isHit ? "var(--accent)" : "var(--fg3)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              {isHit ? "goal reached" : `${remaining.toLocaleString()} remaining`}
            </p>
          </div>

          {/* Minimal progress rule */}
          <div style={{
            width: "100%",
            marginTop: 24,
            height: 1,
            background: "var(--border)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${Math.min(pct * 100, 100)}%`,
              background: isHit
                ? "var(--accent)"
                : `linear-gradient(to right, rgba(196,164,124,0.4), var(--accent))`,
              transition: "width 1.3s cubic-bezier(0.16,1,0.3,1)",
            }} />
          </div>

          <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            marginTop: 7,
          }}>
            <span style={{ fontSize: 10, color: "var(--fg3)", letterSpacing: "0.04em" }}>0</span>
            <span style={{ fontSize: 10, color: "var(--fg3)", letterSpacing: "0.04em" }}>
              {store.today.goal.toLocaleString()}
            </span>
          </div>
        </section>

        {/* ── MEALS ── */}
        <section style={{ flex: 1, padding: "36px 0 0" }}>
          <div style={{
            padding: "0 28px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--fg3)",
            }}>
              Saved meals
            </span>
            {store.meals.length > 0 && (
              <span style={{ fontSize: 10, color: "var(--fg3)", letterSpacing: "0.06em" }}>
                {store.meals.length}
              </span>
            )}
          </div>

          {!loaded ? (
            <SkeletonList />
          ) : store.meals.length === 0 ? (
            <div style={{ padding: "32px 28px", textAlign: "center" }}>
              <p style={{
                color: "var(--fg3)",
                fontSize: 13,
                fontWeight: 300,
                letterSpacing: "0.02em",
                lineHeight: 1.7,
              }}>
                No meals saved yet.<br />Tap + to add your first.
              </p>
            </div>
          ) : (
            <div style={{ borderTop: "1px solid var(--border)" }}>
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
        </section>

        {/* ── URGE TRIGGER ── */}
        <div style={{ padding: "20px 28px 16px" }}>
          <button
            onClick={triggerUrge}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              padding: "14px 16px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 2,
              cursor: "pointer",
              transition: "border-color 0.3s, background 0.3s",
            }}
            onTouchStart={e => {
              e.currentTarget.style.borderColor = "rgba(196,164,124,0.3)";
              e.currentTarget.style.background = "rgba(196,164,124,0.03)";
            }}
            onTouchEnd={e => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Wind size={11} color="var(--fg3)" strokeWidth={1.5} />
            <span style={{
              fontSize: 10,
              color: "var(--fg3)",
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              90-second urge interrupt
            </span>
          </button>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{
          position: "sticky",
          bottom: 0,
          zIndex: 20,
          padding: "12px 28px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editGoal ? (
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                value={goalVal}
                onChange={e => setGoalVal(e.target.value)}
                onBlur={handleGoalSave}
                onKeyDown={e => e.key === "Enter" && handleGoalSave()}
                placeholder={String(store.today.goal)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--fg)",
                  fontSize: 13,
                  fontWeight: 300,
                  fontFamily: "var(--font-body)",
                  width: "100%",
                  letterSpacing: "0.04em",
                }}
              />
            ) : (
              <button
                onClick={() => { setEditGoal(true); setGoalVal(String(store.today.goal)); }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--fg3)",
                  fontSize: 13,
                  fontWeight: 300,
                  fontFamily: "var(--font-body)",
                  padding: 0,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.04em",
                }}
              >
                {store.today.goal.toLocaleString()} kcal goal
              </button>
            )}
          </div>

          <button
            onClick={handleReset}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: confirmReset ? "var(--red)" : "var(--fg3)",
              fontSize: 13,
              fontWeight: 300,
              fontFamily: "var(--font-body)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              flexShrink: 0,
              padding: "0 4px",
              transition: "color 0.3s",
              letterSpacing: "0.04em",
            }}
          >
            <RotateCcw size={11} strokeWidth={1.5} />
            {confirmReset ? "confirm?" : "reset"}
          </button>

          <button
            onClick={() => {
              setModalOpen(true);
              if (navigator.vibrate) navigator.vibrate(25);
            }}
            className="fab"
            aria-label="Add meal"
          >
            <Plus size={20} strokeWidth={2} color="var(--bg)" />
          </button>
        </footer>
      </div>
    </>
  );
}
