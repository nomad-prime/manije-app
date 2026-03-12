"use client";

import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { Plus } from "lucide-react";
import TaskHeader from "@/components/task-header";
import ArtifactViewer from "@/components/artifact-viewer";
import SessionCard from "@/components/session-card";
import type { SessionCardHandle } from "@/components/session-card";
import useMessages from "@/hooks/use-messages";
import useTaskSessions from "@/hooks/use-task-sessions";
import useCreateTaskSession from "@/hooks/use-create-task-session";
import LoadingDots from "@/components/loading-dots";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { AgentTask } from "@/types/tasks";

interface TaskDetailViewProps {
  task: AgentTask;
  projectId: string;
}

const SessionArea = forwardRef<SessionCardHandle, { sessionId: string }>(
  ({ sessionId }, ref) => {
    const { isLoading, data: messages } = useMessages(sessionId);

    if (isLoading) return <LoadingDots />;

    return <SessionCard ref={ref} sessionId={sessionId} initialMessages={messages ?? []} />;
  }
);

SessionArea.displayName = "SessionArea";

function SessionSelector({
  sessions,
  selectedSessionId,
  onSelect,
  onNewSession,
  isCreating,
}: {
  sessions: { id: string; title?: string; created_at: string }[];
  selectedSessionId: string | null;
  onSelect: (id: string) => void;
  onNewSession: () => void;
  isCreating: boolean;
}) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b overflow-x-auto">
      {sessions.map((s) => (
        <Button
          key={s.id}
          variant={s.id === selectedSessionId ? "secondary" : "ghost"}
          size="sm"
          className="text-xs shrink-0"
          onClick={() => onSelect(s.id)}
        >
          {s.title || `Session ${s.id.slice(0, 8)}`}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs shrink-0"
        onClick={onNewSession}
        disabled={isCreating}
      >
        <Plus className="w-3 h-3 mr-1" />
        New
      </Button>
    </div>
  );
}

export default function TaskDetailView({ task, projectId }: TaskDetailViewProps) {
  const { data: sessions, isLoading: isSessionsLoading, error: sessionsError } = useTaskSessions({
    projectId,
    taskId: task.id,
  });

  const createSession = useCreateTaskSession();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const sessionCardRef = useRef<SessionCardHandle>(null);

  const handleAssetSaved = useCallback((content: string) => {
    if (!selectedSessionId || !sessionCardRef.current) return;
    sessionCardRef.current.sendSystemMessage(
      `I've updated the draft asset. Here is the current version:\n\n${content}`
    );
  }, [selectedSessionId]);

  useEffect(() => {
    if (sessions && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  const handleNewSession = async () => {
    const newSession = await createSession.mutateAsync({
      projectId,
      taskId: task.id,
    });
    setSelectedSessionId(newSession.id);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
      <TaskHeader task={task} />

      <div className="flex-1 flex min-h-0">
        {/* Left: Chat session */}
        <div className="flex-1 flex flex-col border-r min-w-0">
          {isSessionsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Skeleton className="h-8 w-48" />
            </div>
          ) : sessionsError ? (
            <div className="flex-1 flex items-center justify-center text-sm text-destructive">
              Failed to load sessions. Please try refreshing.
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
              <p>Task not started yet. No sessions available.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNewSession}
                disabled={createSession.isPending}
              >
                <Plus className="w-3 h-3 mr-1" />
                Start a session
              </Button>
            </div>
          ) : (
            <>
              <SessionSelector
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelect={setSelectedSessionId}
                onNewSession={handleNewSession}
                isCreating={createSession.isPending}
              />
              <div className="flex-1 flex flex-col relative items-center overflow-y-auto">
                {selectedSessionId && <SessionArea ref={sessionCardRef} sessionId={selectedSessionId} />}
              </div>
            </>
          )}
        </div>

        {/* Right: Artifact viewer */}
        <div className="w-[45%] shrink-0 overflow-y-auto">
          <ArtifactViewer assetId={task.draft_asset_id ?? null} projectId={projectId} onAssetSaved={handleAssetSaved} />
        </div>
      </div>
    </div>
  );
}
