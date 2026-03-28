"use client";

import { ListChecks } from "lucide-react";
import type { ShowTaskOutput } from "@/types/tools";

const statusColors: Record<string, string> = {
  unclaimed: "bg-gray-400",
  claimed: "bg-blue-400",
  in_progress: "bg-yellow-400",
  completed: "bg-green-400",
  failed: "bg-red-400",
};

const statusLabels: Record<string, string> = {
  unclaimed: "Queued",
  claimed: "Claimed",
  in_progress: "In Progress",
  completed: "Completed",
  failed: "Failed",
};

interface TaskDetailCardProps {
  task: ShowTaskOutput;
  onStartConversation?: () => void;
}

export default function TaskDetailCard({ task, onStartConversation }: TaskDetailCardProps) {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-surface-container-high">
          <ListChecks className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug">
            {task.title || task.description}
          </h3>
          {task.title && task.description && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span
          className={`w-2 h-2 rounded-full ${statusColors[task.status] || "bg-gray-400"}`}
        />
        <span className="text-xs text-muted-foreground">
          {statusLabels[task.status] || task.status}
        </span>
        <span className="text-xs text-muted-foreground">
          &middot; {task.type === "follow_up" ? "Follow-up" : "Genesis"}
        </span>
      </div>

      {task.asset_id && (
        <div className="text-xs text-muted-foreground mb-4">
          Linked asset: <span className="font-mono">{task.asset_id.slice(0, 8)}</span>
        </div>
      )}

      {onStartConversation && (
        <button
          onClick={onStartConversation}
          className="mt-auto text-sm px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          Start conversation about this task
        </button>
      )}
    </div>
  );
}
