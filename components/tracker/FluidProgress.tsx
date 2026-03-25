"use client";

interface Props { pct: number; size?: number; }

export function FluidProgress({ pct, size = 180 }: Props) {
  const clampedPct = Math.min(Math.max(pct, 0), 1);
  const fillPct = Math.round(clampedPct * 100);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* Ambient glow behind the blob */}
      <div style={{
        position: "absolute",
        inset: -12,
        borderRadius: "50%",
        background: `radial-gradient(circle at 50% 60%, rgba(196,164,124,${clampedPct * 0.18}) 0%, transparent 70%)`,
        filter: "blur(12px)",
        transition: "background 1.4s ease",
        pointerEvents: "none",
      }} />

      {/* Morphing blob container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          background: "var(--surface)",
          animation: "blobMorph 9s ease-in-out infinite",
          willChange: "border-radius",
        }}
      >
        {/* Fluid fill — rises from bottom */}
        <div style={{
          position: "absolute",
          left: "-5%", right: "-5%",
          bottom: 0,
          height: `${fillPct}%`,
          background: `linear-gradient(
            to top,
            rgba(196,164,124,0.9) 0%,
            rgba(212,180,140,0.6) 50%,
            rgba(196,164,124,0.15) 100%
          )`,
          transition: "height 1.4s cubic-bezier(0.16,1,0.3,1)",
        }} />

        {/* Wave shimmer at fill boundary */}
        {clampedPct > 0.02 && (
          <div style={{
            position: "absolute",
            left: "-10%", right: "-10%",
            bottom: `calc(${fillPct}% - 10px)`,
            height: "20px",
            background: "radial-gradient(ellipse at 50% 100%, rgba(212,190,150,0.35) 0%, transparent 70%)",
            transition: "bottom 1.4s cubic-bezier(0.16,1,0.3,1)",
          }} />
        )}
      </div>

      {/* Percentage label at center */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}>
        <span style={{
          fontSize: 13,
          fontWeight: 500,
          color: clampedPct > 0.4
            ? `rgba(12,12,10,${Math.min((clampedPct - 0.4) * 2.5, 0.8)})`
            : "var(--fg3)",
          letterSpacing: "0.04em",
          transition: "color 0.8s ease",
        }}>
          {fillPct}%
        </span>
      </div>
    </div>
  );
}
