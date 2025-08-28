"use client";

import { Loader2 } from "lucide-react";
import useBootstrap from "@/hooks/use-bootstrap";
import { Home } from "@/components/home";

export default function Page() {
  const { loading, error } = useBootstrap();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    throw new Error(error);
  }

  return <div className="h-[calc(100vh-64px)] flex flex-col bg-background text-foreground font-sans">
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <Home />
    </div>
  </div>
}
