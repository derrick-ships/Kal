"use client";
import { useEffect, useState, useRef } from "react";
import { useWebHaptics } from "web-haptics/react";
import WebHaptics from "web-haptics";

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
  const { trigger } = useWebHaptics();

  // Entrance haptic
  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([60, 30, 80]);
  }, []);

  // Countdown
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setT(p => {
      if (p <= 1) { clearInterval(id); setDone(true); setTimeout(onDone, 2600); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [done, onDone]);

  // Phase cycling
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setPt(p => {
      if (p + 100 >= PHASE_MS) {
        phaseIdx.current = (phaseIdx.current + 1) % 4;
        const newPhase = PHASES[phaseIdx.current];
        setPhase(newPhase);
        if (navigator.vibrate) navigator.vibrate(12);
        return 0;
      }
      return p + 100;
    }), 100);
    return () => clearInterval(id);
  }, [done]);

  const prog = pt / PHASE_MS;
  const isExpand = phase === "in" || phase === "hold1";

  const scale = phase === "in" ? 1 + prog * 0.3
    : phase === "hold1" ? 1.3
    : phase === "out" ? 1.3 - prog * 0.3
    : 1.0;

  const accentColor = isExpand ? "rgba(196,164,124,0.7)" : "rgba(180,200,196,0.6)";
  const bgGlow = isExpand
    ? "radial-gradient(ellipse at 50% 55%, rgba(196,164,124,0.06) 0%, transparent 65%)"
    : "radial-gradient(ellipse at 50% 55%, rgba(160,185,196,0.06) 0%, transparent 65%)";

  return (
    <div
      className="overlay-portal anim-urge-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A0A08",
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        background: bgGlow,
        transition: "background 2s ease",
        pointerEvents: "none",
      }} />

      {!done ? (
        <>
          {/* "urge interrupt" label — was 0.20 → 0.50 (was 1.6:1, now 4.7:1) */}
          <p style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(240,235,224,0.50)",
            marginBottom: 48,
            fontFamily: "var(--font-display)",
          }}>
            urge interrupt
          </p>

          {/* Countdown — 0.88 was already passing */}
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 108,
            fontWeight: 100,
            color: "rgba(240,235,224,0.88)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            marginBottom: 8,
            fontVariantNumeric: "tabular-nums",
            transition: "color 0.5s ease",
          }}>
            {t}
          </div>

          {/* "seconds" label — was 0.22 → 0.50 (was 1.8:1, now 4.7:1) */}
          <p style={{
            fontSize: 10,
            color: "rgba(240,235,224,0.50)",
            marginBottom: 56,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            seconds
          </p>

          {/* Breathing orb */}
          <div style={{ position: "relative", width: 100, height: 100 }}>
            <div style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${accentColor.replace("0.7", "0.12")} 0%, transparent 70%)`,
              filter: "blur(8px)",
              transform: `scale(${scale})`,
              transition: "transform 0.1s linear, background 1s ease",
            }} />
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: `1px solid ${accentColor}`,
              background: `radial-gradient(circle at 40% 35%, ${accentColor.replace("0.7", "0.08")} 0%, transparent 70%)`,
              transform: `scale(${scale})`,
              transition: "transform 0.1s linear, border-color 1s ease, background 1s ease",
              willChange: "transform",
            }} />
          </div>

          {/* Phase label — 0.55 was already passing (4.9:1) */}
          <p style={{
            marginTop: 40,
            fontSize: 14,
            fontWeight: 300,
            color: "rgba(240,235,224,0.55)",
            letterSpacing: "0.06em",
          }}>
            {LABELS[phase]}
          </p>

          {/* "4·4·4·4" — was 0.16 → 0.50 (was 1.5:1, now 4.7:1) */}
          <p style={{
            marginTop: 5,
            fontSize: 9,
            color: "rgba(240,235,224,0.50)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            4 · 4 · 4 · 4
          </p>

          {/* Phase dots — non-text UI, was 0.10 → 0.35 (was 1.3:1, now 3.3:1, meets 3:1 non-text) */}
          <div style={{ display: "flex", gap: 6, marginTop: 28 }}>
            {PHASES.map(p => (
              <div key={p} style={{
                height: 2,
                width: p === phase ? 22 : 5,
                borderRadius: 1,
                background: p === phase ? accentColor : "rgba(240,235,224,0.35)",
                transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
              }} />
            ))}
          </div>

          {/* "esc" — was 0.20 → 0.50 (was 1.6:1, now 4.7:1) */}
          <button
            onClick={() => {
              if (WebHaptics.isSupported) trigger("nudge");
              else if (navigator.vibrate) navigator.vibrate(20);
              onDone();
            }}
            style={{
              position: "absolute",
              top: "max(28px, env(safe-area-inset-top))",
              right: 24,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(240,235,224,0.50)",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              padding: "8px 4px",
            }}
          >
            esc
          </button>
        </>
      ) : (
        <div className="anim-fade-up" style={{ textAlign: "center", padding: "0 48px" }}>
          {/* "complete" label — was rgba(accent,0.5) → var(--accent) full (was 2.9:1, now 8.4:1) */}
          <p style={{
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 20,
          }}>
            complete
          </p>
          <h2 style={{
            fontSize: 32,
            fontWeight: 200,
            color: "var(--fg)",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 12,
          }}>
            Urge passed.
          </h2>
          {/* "Back to tracking." — was 0.30 → 0.50 (was 2.4:1, now 4.7:1) */}
          <p style={{
            color: "rgba(240,235,224,0.50)",
            fontSize: 13,
            fontWeight: 300,
            letterSpacing: "0.04em",
          }}>
            Back to tracking.
          </p>
        </div>
      )}
    </div>
  );
}
