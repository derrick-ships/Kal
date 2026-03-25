"use client";
import { useEffect, useState, useRef } from "react";

interface Props { onDone: () => void; }
type Phase = "in" | "hold1" | "out" | "hold2";
const PHASES: Phase[] = ["in", "hold1", "out", "hold2"];
const LABELS: Record<Phase, string> = { in: "Inhale", hold1: "Hold", out: "Exhale", hold2: "Hold" };
const PHASE_MS = 4000;
const TOTAL = 90;

export function UrgeOverlay({ onDone }: Props) {
  const [t, setT] = useState(TOTAL);
  const [phase, setPhase] = useState<Phase>("in");
  const [pt, setPt] = useState(0);
  const [done, setDone] = useState(false);
  const phaseIdx = useRef(0);

  useEffect(() => { if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 150]); }, []);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setT(p => {
      if (p <= 1) { clearInterval(id); setDone(true); setTimeout(onDone, 2800); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [done, onDone]);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setPt(p => {
      if (p + 100 >= PHASE_MS) {
        phaseIdx.current = (phaseIdx.current + 1) % 4;
        setPhase(PHASES[phaseIdx.current]);
        return 0;
      }
      return p + 100;
    }), 100);
    return () => clearInterval(id);
  }, [done]);

  const prog = pt / PHASE_MS;
  const isWarm = phase === "in" || phase === "hold1";
  const scale = phase === "in" ? 1 + prog * 0.25
    : phase === "hold1" ? 1.25
    : phase === "out" ? 1.25 - prog * 0.25 : 1;

  const boxShadow = isWarm
    ? `0 0 0 2px #FF453A, 0 0 30px 4px rgba(255,69,58,0.25)`
    : `0 0 0 2px #30D158, 0 0 30px 4px rgba(48,209,88,0.25)`;

  const borderColor = isWarm ? "#FF453A" : "#30D158";

  const bg = done
    ? "radial-gradient(ellipse at 50% 40%, #042a1d 0%, #060606 70%)"
    : isWarm
    ? "radial-gradient(ellipse at 50% 40%, #200808 0%, #060606 70%)"
    : "radial-gradient(ellipse at 50% 40%, #041c12 0%, #060606 70%)";

  const mins = String(Math.floor(t / 60)).padStart(2, "0");
  const secs = String(t % 60).padStart(2, "0");

  return (
    <div className="overlay-portal anim-urge-in" style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: bg, transition: "background 2s ease",
    }}>
      {!done ? (
        <>
          {/* Label */}
          <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)", marginBottom: 36,
            fontFamily: "var(--font-display)" }}>
            urge interrupt
          </p>

          {/* Timer */}
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 80, fontWeight: 700,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.05em", lineHeight: 1,
            marginBottom: 10,
          }}>
            {mins}:{secs}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 60, letterSpacing: "0.04em" }}>
            {LABELS[phase].toLowerCase()}
          </p>

          {/* Breathing square */}
          <div style={{ width: 120, height: 120, borderRadius: 26,
            border: `2px solid ${borderColor}`,
            background: "transparent",
            transform: `scale(${scale})`,
            transition: "transform 0.1s linear, border-color 0.5s ease, box-shadow 0.5s ease",
            boxShadow,
            willChange: "transform, box-shadow",
          }} />

          <p style={{ marginTop: 52, fontSize: 16, fontWeight: 500,
            color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>
            {LABELS[phase]}
          </p>
          <p style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,0.18)",
            fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}>
            4 · 4 · 4 · 4
          </p>

          {/* Phase indicator — pill dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 32 }}>
            {PHASES.map(p => (
              <div key={p} style={{
                height: 4,
                width: p === phase ? 24 : 6,
                borderRadius: 2,
                background: p === phase
                  ? (isWarm ? "#FF453A" : "#30D158")
                  : "rgba(255,255,255,0.12)",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }} />
            ))}
          </div>
        </>
      ) : (
        <div className="anim-fade-up" style={{ textAlign: "center", padding: "0 40px" }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>💪</div>
          <h2 style={{ fontSize: 30, fontWeight: 600, color: "var(--fg)",
            letterSpacing: "-0.03em", marginBottom: 10 }}>Urge beaten.</h2>
          <p style={{ color: "var(--fg3)", fontSize: 15 }}>Back to tracking.</p>
        </div>
      )}
    </div>
  );
}
