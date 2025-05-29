export const ShimmerTitle = () => {
  return (
    <div className="h-5 w-36 rounded-md bg-muted animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}
