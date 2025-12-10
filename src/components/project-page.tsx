"use client";

import { usePathname } from "next/navigation";
import SessionList from "@/components/session-list";
import SessionCard from "@/components/session-card";
import { ProjectOverview } from "@/components/project-overview";
import useMessages from "@/hooks/use-messages";
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

export default function ProjectPage() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const projectId = segments[1];

  const sessionId = segments[2] === "sessions" ? segments[3] : null;

  const handleSessionSelect = (sessionId: string) => {
    window.history.pushState(
      {},
      "",
      `/projects/${projectId}/sessions/${sessionId}`,
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <div className="max-w-60 w-full border-r h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <SessionList projectId={projectId} onSelect={handleSessionSelect} />
      </div>
      {sessionId ? (
        <MessageList sessionId={sessionId} />
      ) : (
        <div className="flex-1 flex flex-col relative ">
          <ProjectOverview projectId={projectId} />
        </div>
      )}
    </div>
  );
}
