"use client";

import { usePathname, useRouter } from "next/navigation";
import TaskSidebar from "@/components/task-sidebar";
import TaskDetailView from "@/components/task-detail-view";
import SessionCard from "@/components/session-card";
import { ProjectOverview } from "@/components/project-overview";
import useMessages from "@/hooks/use-messages";
import useTask from "@/hooks/use-task";
import LoadingDots from "@/components/loading-dots";

function MessageList({ sessionId }: { sessionId: string }) {
  const { isLoading, data: messages } = useMessages(sessionId);

  if (isLoading) return <LoadingDots />;

  return (
    <div className="flex-1 flex flex-col relative items-center">
      <SessionCard sessionId={sessionId} initialMessages={messages ?? []} />
    </div>
  );
}

function TaskContent({ projectId, taskId }: { projectId: string; taskId: string }) {
  const { data: task, isLoading, error } = useTask({ projectId, taskId });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        Task not found.
      </div>
    );
  }

  return <TaskDetailView task={task} projectId={projectId} />;
}

export default function ProjectPage() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter(Boolean);
  const projectId = segments[1];

  const sessionId = segments[2] === "sessions" ? segments[3] : null;
  const taskId = segments[2] === "tasks" ? segments[3] : null;

  const handleTaskSelect = (taskId: string) => {
    router.push(`/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="max-w-72 w-full border-r h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <TaskSidebar
          projectId={projectId}
          selectedTaskId={taskId}
          onSelect={handleTaskSelect}
        />
      </div>
      {taskId ? (
        <TaskContent projectId={projectId} taskId={taskId} />
      ) : sessionId ? (
        <MessageList sessionId={sessionId} />
      ) : (
        <div className="flex-1 flex flex-col relative">
          <ProjectOverview projectId={projectId} />
        </div>
      )}
    </div>
  );
}
