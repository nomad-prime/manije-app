"use client";

import { Badge } from "@/components/ui/badge";
import type { AgentTask } from "@/types/tasks";

const statusColors: Record<string, string> = {
  unclaimed: "bg-gray-100 text-gray-800",
  claimed: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const typeLabels: Record<string, string> = {
  genesis: "Genesis",
  follow_up: "Follow-up",
};

interface TaskHeaderProps {
  task: AgentTask;
}

export default function TaskHeader({ task }: TaskHeaderProps) {
  return (
    <div className="border-b px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{task.description}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {task.claimed_by && <span>Agent: {task.claimed_by}</span>}
          <span>{new Date(task.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline">{typeLabels[task.type] || task.type}</Badge>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status] || ""}`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>
    </div>
  );
}
