"use client";

import { ManijeButton } from "@/components/ui/manije-button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <ManijeButton onClick={() => reset()}>Try again</ManijeButton>
    </div>
  );
}
