export function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card h-16 animate-shimmer rounded-2xl"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}