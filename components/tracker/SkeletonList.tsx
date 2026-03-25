export function SkeletonList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[56, 56, 56].map((h, i) => (
        <div key={i} className="anim-shimmer" style={{
          height: h,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </div>
  );
}