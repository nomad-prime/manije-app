"use client";

import { useEffect } from "react";
import { useAssetPanel } from "@/hooks/use-asset-panel";
import { useTaskPanel } from "@/hooks/use-task-panel";

type ToolPartState = "input-streaming" | "input-available" | "output-available" | "output-error";

interface HideContextToolPartProps {
  state: ToolPartState;
}

export const HideContextToolPart = ({ state }: HideContextToolPartProps) => {
  const { hideAsset } = useAssetPanel();
  const { hideTask } = useTaskPanel();

  useEffect(() => {
    if (state === "output-available") {
      hideAsset();
      hideTask();
    }
  }, [state, hideAsset, hideTask]);

  return null;
};
