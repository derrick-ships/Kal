"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface Props { open: boolean; onClose: () => void; onSave: (name: string, kcal: number) => void; }

export function AddMealModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [err, setErr] = useState("");

  if (!open) return null;

  const submit = () => {
    if (!name.trim()) { setErr("Name required"); return; }
    const k = parseInt(kcal);
    if (!k || k <= 0) { setErr("Valid kcal required"); return; }
    onSave(name.trim(), k);
    setName(""); setKcal(""); setErr(""); onClose();
  };

  return (
    <div className="overlay-portal" style={{
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="anim-sheet" style={{
        width: "100%", maxWidth: 430,
        background: "var(--surface)",
        borderTop: "1px solid var(--border2)",
        borderRadius: "24px 24px 0 0",
        padding: "0 20px calc(28px + env(safe-area-inset-bottom))",
      }}>
        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 20px" }}>
          <div style={{ width: 32, height: 4, background: "var(--border2)", borderRadius: 2 }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--fg)", letterSpacing: "-0.03em" }}>Log meal</h2>
            <p style={{ fontSize: 12, color: "var(--fg3)", marginTop: 2 }}>Add to today's total</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)",
            background: "transparent", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: "var(--fg2)",
          }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--fg3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Meal name
            </label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)}
              placeholder="Oatmeal bowl" autoFocus />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--fg3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Calories (kcal)
            </label>
            <input className="input-field" type="number" inputMode="numeric"
              value={kcal} onChange={e => setKcal(e.target.value)}
              placeholder="450" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          {err && <p style={{ fontSize: 12, color: "var(--red)" }}>{err}</p>}
        </div>

        <button onClick={submit} className="btn-primary" style={{
          width: "100%", height: 52, fontSize: 15, marginTop: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          letterSpacing: "-0.01em",
        }}>
          Save &amp; Add to today
        </button>
      </div>
    </div>
  );
}