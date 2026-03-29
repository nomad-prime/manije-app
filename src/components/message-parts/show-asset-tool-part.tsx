"use client";

import { useEffect } from "react";
import { FileText } from "lucide-react";
import { useAssetPanel } from "@/hooks/use-asset-panel";
import type { ShowAssetOutput } from "@/types/tools";

type ToolPartState = "input-streaming" | "input-available" | "output-available" | "output-error";

interface ShowAssetToolPartProps {
  state: ToolPartState;
  output?: ShowAssetOutput;
  errorText?: string;
}

export const ShowAssetToolPart = ({ state, output, errorText }: ShowAssetToolPartProps) => {
  const { showAsset } = useAssetPanel();

  useEffect(() => {
    if (state === "output-available" && output) {
      showAsset(output.asset_id, output);
    }
  }, [state, output, showAsset]);

  if (state === "input-streaming") {
    return (
      <div className="text-sm text-muted-foreground">
        Loading asset...
      </div>
    );
  }

  if (state === "output-error") {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        Failed to load asset: {errorText}
      </div>
    );
  }

  if (state === "output-available" && output) {
    return (
      <button
        onClick={() => showAsset(output.asset_id, output)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors cursor-pointer text-left max-w-[80%]"
      >
        <FileText className="w-4 h-4 shrink-0 text-muted-foreground" />
        <span className="truncate font-medium">{output.title}</span>
        <span className="text-xs text-muted-foreground shrink-0">
          {output.status === "pending_review" ? "Draft" : "Active"}
        </span>
      </button>
    );
  }

  return null;
};
