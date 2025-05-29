"use client";
import { Home } from "@/components/home";

export default function Page() {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-background text-foreground font-sans">
      <div className="flex-1 flex items-center justify-center p-4">
        <Home />
      </div>
    </div>
  );
}
