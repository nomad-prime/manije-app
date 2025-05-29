const LoadingDots = () => {
  return (
    <span className="inline-flex items-center justify-center gap-[2px] ml-1">
      <span className="w-[4px] h-[4px] rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.2s]" />
      <span className="w-[4px] h-[4px] rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.1s]" />
      <span className="w-[4px] h-[4px] rounded-full bg-muted-foreground animate-bounce" />
    </span>
  );
};

export default LoadingDots;
