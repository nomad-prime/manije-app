export const ShimmerTitle = ({ text }: { text: string }) => {
  return (
    <div className="h-5 w-36 rounded-md animate-pulse relative overflow-hidden">
      <p className="italic">{text}</p>
    </div>
  );
};
