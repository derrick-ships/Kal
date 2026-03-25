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
    if (!k || k <= 0) { setErr("Enter a valid calorie amount"); return; }
    onSave(name.trim(), k);
    setName(""); setKcal(""); setErr(""); onClose();
  };

  return (
    <div
      className="overlay-portal"
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="anim-sheet"
        style={{
          width: "100%",
          maxWidth: 430,
          background: "var(--surface2)",
          borderRadius: "16px 16px 0 0",
          padding: "0 28px calc(36px + env(safe-area-inset-bottom))",
          borderTop: "1px solid var(--border2)",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 28px" }}>
          <div style={{
            width: 28,
            height: 3,
            background: "rgba(240,235,224,0.15)",
            borderRadius: 2,
          }} />
        </div>

        {/* Title row */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 36,
        }}>
          <div>
            <h2 style={{
              fontSize: 18,
              fontWeight: 300,
              color: "var(--fg)",
              letterSpacing: "0.01em",
              lineHeight: 1.2,
            }}>
              New meal
            </h2>
            <p style={{
              fontSize: 11,
              color: "var(--fg3)",
              marginTop: 4,
              letterSpacing: "0.04em",
            }}>
              Saved to your quick-log list
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fg3)",
              transition: "border-color 0.2s",
            }}
          >
            <X size={13} strokeWidth={1.5} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <label style={{
              display: "block",
              fontSize: 9,
              fontWeight: 500,
              color: "var(--fg3)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              marginBottom: 12,
            }}>
              Name
            </label>
            <input
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Oatmeal bowl"
              autoFocus
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: 9,
              fontWeight: 500,
              color: "var(--fg3)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              marginBottom: 12,
            }}>
              Calories
            </label>
            <input
              className="input-field"
              type="number"
              inputMode="numeric"
              value={kcal}
              onChange={e => setKcal(e.target.value)}
              placeholder="450"
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>

          {err && (
            <p style={{
              fontSize: 11,
              color: "var(--red)",
              letterSpacing: "0.02em",
              marginTop: -12,
            }}>
              {err}
            </p>
          )}
        </div>

        <button
          onClick={submit}
          className="btn-primary"
          style={{
            width: "100%",
            height: 50,
            fontSize: 13,
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Save meal
        </button>
      </div>
    </div>
  );
}
