"use client";
import { useEffect, useState, useRef } from "react";

interface Props { onDone: () => void; }
type Phase = "in" | "hold1" | "out" | "hold2";

const PHASE_LABELS: Record<Phase, string> = { in: "Breathe in", hold1: "Hold", out: "Breathe out", hold2: "Hold" };
const PHASES: Phase[] = ["in", "hold1", "out", "hold2"];
const PHASE_DURATION = 4000;
const TOTAL_SECONDS = 90;

export function UrgeOverlay({ onDone }: Props) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [phase, setPhase] = useState<Phase>("in");
  const [phaseTime, setPhaseTime] = useState(0);
  const [done, setDone] = useState(false);
  const phaseRef = useRef(0);

  useEffect(() => { if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]); }, []);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); setDone(true); setTimeout(onDone, 2500); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [done, onDone]);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setPhaseTime((t) => {
        if (t + 100 >= PHASE_DURATION) {
          phaseRef.current = (phaseRef.current + 1) % 4;
          setPhase(PHASES[phaseRef.current]);
          return 0;
        }
        return t + 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [done]);

  const progress = phaseTime / PHASE_DURATION;
  const squareScale = phase === "in" ? 1 + progress * 0.18 : phase === "hold1" ? 1.18 : phase === "out" ? 1.18 - progress * 0.18 : 1;
  const squareColor = phase === "in" ? `rgba(239,68,68,${0.6 + progress * 0.3})` : phase === "hold1" ? "rgba(251,146,60,0.9)" : phase === "out" ? `rgba(16,185,129,${0.3 + progress * 0.6})` : "rgba(16,185,129,0.4)";
  const bgClass = done ? "from-emerald-900/90 to-emerald-800/90" : phase === "in" || phase === "hold1" ? "from-red-950/95 via-red-900/80 to-orange-900/70" : "from-emerald-950/95 via-emerald-900/80 to-teal-900/70";
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br ${bgClass} animate-urge-in`}
      style={{ transition: "background 2s ease" }}>
      {!done ? (
        <>
          <div className="text-7xl font-bold text-white/90 tabular-nums mb-2">{mins}:{secs}</div>
          <p className="text-white/50 text-sm font-medium mb-16 tracking-widest uppercase">Beat the urge</p>
          <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
            <div className="rounded-3xl border-4" style={{
              width: 120, height: 120,
              transform: `scale(${squareScale})`,
              borderColor: squareColor,
              backgroundColor: squareColor.replace("0.9", "0.12").replace("0.6", "0.08").replace("0.4", "0.06"),
              transition: "transform 0.1s linear, border-color 0.5s ease",
              boxShadow: `0 0 40px ${squareColor}`,
            }} />
          </div>
          <p className="mt-10 text-white/80 text-lg font-semibold tracking-wide">{PHASE_LABELS[phase]}</p>
          <p className="text-white/40 text-sm mt-1">4 · 4 · 4 · 4</p>
          <div className="flex gap-2 mt-6">
            {PHASES.map((p) => (
              <div key={p} className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: p === phase ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)", transform: p === phase ? "scale(1.4)" : "scale(1)" }} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center animate-fade-in px-8">
          <div className="text-6xl mb-4">💪</div>
          <h2 className="text-3xl font-bold text-white mb-2">Urge beaten.</h2>
          <p className="text-white/60 text-lg">Back to tracking.</p>
        </div>
      )}
    </div>
  );
}