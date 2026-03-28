"use client";

import { useEffect } from "react";
import { useContextPanel } from "@/hooks/use-context-panel";

type ToolPartState = "input-streaming" | "input-available" | "output-available" | "output-error";

interface HideContextToolPartProps {
  state: ToolPartState;
}

export const HideContextToolPart = ({ state }: HideContextToolPartProps) => {
  const { hideContext } = useContextPanel();

  useEffect(() => {
    if (state === "output-available") {
      hideContext();
    }
  }, [state, hideContext]);

  return null;
};
