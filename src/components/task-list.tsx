"use client";

import { useTasks } from "@/hooks/use-tasks";
import { TaskCard, TaskCardSkeleton } from "@/components/task-card";
import type { TaskStatus, TaskType } from "@/types/tasks";

type TaskListProps = {
  projectId: string | null;
  status?: TaskStatus;
  type?: TaskType;
};

export function TaskList({ projectId, status, type }: TaskListProps) {
  const { data: tasks, isLoading, error } = useTasks({ projectId, status, type });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Failed to load tasks
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tasks found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
