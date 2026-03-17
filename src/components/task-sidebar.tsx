"use client";

import { useTasks } from "@/hooks/use-tasks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AgentTask } from "@/types/tasks";

const statusColors: Record<string, string> = {
  unclaimed: "bg-gray-400",
  claimed: "bg-blue-400",
  in_progress: "bg-yellow-400",
  completed: "bg-green-400",
  failed: "bg-red-400",
};

interface TaskSidebarProps {
  projectId: string | null;
  selectedTaskId: string | null;
  onSelect: (taskId: string) => void;
}

function sortNewestFirst(tasks: AgentTask[]): AgentTask[] {
  return [...tasks].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

const TaskSidebar = ({ projectId, selectedTaskId, onSelect }: TaskSidebarProps) => {
  const { data: tasks, isLoading } = useTasks({
    projectId,
    type: "follow_up",
    refetchInterval: 10_000,
  });

  if (isLoading) {
    return <TaskSidebarSkeleton />;
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No tasks yet.
        <br />
        The agent will create tasks as it works.
      </div>
    );
  }

  const sorted = sortNewestFirst(tasks);

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {sorted.map((task) => (
          <Button
            key={task.id}
            variant={task.id === selectedTaskId ? "secondary" : "ghost"}
            className="w-full justify-start text-left hover:bg-muted h-auto py-2 px-3 whitespace-normal items-start"
            onClick={() => onSelect(task.id)}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${statusColors[task.status] || "bg-gray-400"}`}
            />
            <span className="block text-sm leading-snug line-clamp-2">
              {task.title || task.description}
            </span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

function TaskSidebarSkeleton() {
  return (
    <div className="p-2 space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}

export default TaskSidebar;
