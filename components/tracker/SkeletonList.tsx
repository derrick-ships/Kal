export function SkeletonList() {
  return (
    <div style={{ borderTop: "1px solid var(--border)" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "18px 28px",
          borderBottom: i < 2 ? "1px solid var(--border)" : "none",
        }}>
          <div className="anim-shimmer" style={{
            width: 5, height: 5,
            borderRadius: "50%",
            background: "var(--border2)",
            animationDelay: `${i * 0.15}s`,
            flexShrink: 0,
          }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="anim-shimmer" style={{
              height: 12,
              width: `${50 + i * 12}%`,
              background: "var(--surface2)",
              borderRadius: 2,
              animationDelay: `${i * 0.15}s`,
            }} />
            <div className="anim-shimmer" style={{
              height: 9,
              width: "22%",
              background: "var(--surface2)",
              borderRadius: 2,
              animationDelay: `${i * 0.15 + 0.08}s`,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
