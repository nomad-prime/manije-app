"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useCallback, useState } from "react";
import SessionList from "@/components/session-list";
import SessionCard from "@/components/session-card";
import type { SessionCardHandle } from "@/components/session-card";
import ContextPanel from "@/components/context-panel";
import ProjectDashboard from "@/components/project-dashboard";
import useMessages from "@/hooks/use-messages";
import useCreateSession from "@/hooks/use-create-session";
import useSessions from "@/hooks/use-sessions";
import LoadingDots from "@/components/loading-dots";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, LayoutGrid } from "lucide-react";
import { ContextPanelProvider, useContextPanel } from "@/hooks/use-context-panel";
import { useNotifications } from "@/hooks/use-notifications";

function MessageList({ sessionId, projectId }: { sessionId: string; projectId: string }) {
  const { isLoading, data: messages } = useMessages(sessionId);
  const sessionCardRef = useRef<SessionCardHandle>(null);

  const handleAssetSaved = useCallback((content: string) => {
    sessionCardRef.current?.sendSystemMessage(
      `I've updated the asset. Here is the current version:\n\n${content}`
    );
  }, []);

  if (isLoading) return <LoadingDots />;

  return (
    <>
      <div className="flex-1 flex flex-col relative items-center overflow-y-auto">
        <SessionCard ref={sessionCardRef} sessionId={sessionId} initialMessages={messages ?? []} />
      </div>
      <ContextPanel projectId={projectId} onAssetSaved={handleAssetSaved} />
    </>
  );
}

function ProjectPageContent({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const createSession = useCreateSession();
  const [showDashboard, setShowDashboard] = useState(false);
  const { showAsset, showTask } = useContextPanel();

  const segments = pathname.split("/").filter(Boolean);
  const sessionId = segments[2] === "sessions" ? segments[3] : null;

  const { data: sessions } = useSessions(projectId);
  const latestSessionId = sessions?.[0]?.id ?? null;
  const activeSessionId = sessionId ?? latestSessionId;

  // Background work notifications
  useNotifications({
    projectId,
    onAssetReady: (assetId, title) => {
      showAsset(assetId, {
        asset_id: assetId,
        title,
        description: "",
        content: "",
        status: "pending_review",
        type: "",
      });
    },
    onTaskCompleted: (taskId, title) => {
      showTask(taskId, {
        task_id: taskId,
        title,
        description: "",
        status: "completed",
        type: "follow_up",
      });
    },
  });

  const handleSessionSelect = (sessionId: string) => {
    router.push(`/projects/${projectId}/sessions/${sessionId}`);
  };

  const handleNewSession = async () => {
    const session = await createSession.mutateAsync({ projectId });
    router.push(`/projects/${projectId}/sessions/${session.id}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left: Session list */}
      <div className="w-60 shrink-0 bg-surface-container-low h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Conversations
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setShowDashboard(!showDashboard)}
              title="Project dashboard"
            >
              <LayoutGrid className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleNewSession}
              disabled={createSession.isPending}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <SessionList projectId={projectId} onSelect={handleSessionSelect} />
      </div>

      {/* Center: Conversation or Dashboard */}
      {showDashboard ? (
        <div className="flex-1 flex flex-col relative bg-surface overflow-y-auto">
          <ProjectDashboard projectId={projectId} />
        </div>
      ) : activeSessionId ? (
        <MessageList sessionId={activeSessionId} projectId={projectId} />
      ) : (
        <div className="flex-1 flex flex-col relative bg-surface">
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <MessageSquare className="w-10 h-10 text-muted-foreground/50" />
            <div>
              <h2 className="text-lg font-semibold mb-1">Start a conversation</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Talk to the agent about your project. It will help you create assets, manage tasks, and track progress.
              </p>
            </div>
            <Button onClick={handleNewSession} disabled={createSession.isPending}>
              <Plus className="w-4 h-4" />
              New Conversation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectPage() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const projectId = segments[1];

  return (
    <ContextPanelProvider>
      <ProjectPageContent projectId={projectId} />
    </ContextPanelProvider>
  );
}
