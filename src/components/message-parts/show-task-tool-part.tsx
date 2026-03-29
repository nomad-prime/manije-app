"use client";

import { useEffect } from "react";
import { ListChecks } from "lucide-react";
import { useTaskPanel } from "@/hooks/use-task-panel";
import type { ShowTaskOutput } from "@/types/tools";

type ToolPartState = "input-streaming" | "input-available" | "output-available" | "output-error";

interface ShowTaskToolPartProps {
  state: ToolPartState;
  output?: ShowTaskOutput;
  errorText?: string;
}

const statusLabels: Record<string, string> = {
  unclaimed: "Queued",
  claimed: "Claimed",
  in_progress: "In Progress",
  completed: "Done",
  failed: "Failed",
};

export const ShowTaskToolPart = ({ state, output, errorText }: ShowTaskToolPartProps) => {
  const { showTask } = useTaskPanel();

  useEffect(() => {
    if (state === "output-available" && output) {
      showTask(output.task_id, output);
    }
  }, [state, output, showTask]);

  if (state === "input-streaming") {
    return (
      <div className="text-sm text-muted-foreground">
        Loading task...
      </div>
    );
  }

  if (state === "output-error") {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        Failed to load task: {errorText}
      </div>
    );
  }

  if (state === "output-available" && output) {
    return (
      <button
        onClick={() => showTask(output.task_id, output)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors cursor-pointer text-left max-w-[80%]"
      >
        <ListChecks className="w-4 h-4 shrink-0 text-muted-foreground" />
        <span className="truncate font-medium">{output.title || output.description}</span>
        <span className="text-xs text-muted-foreground shrink-0">
          {statusLabels[output.status] || output.status}
        </span>
      </button>
    );
  }

  return null;
};
