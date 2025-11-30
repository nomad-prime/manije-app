"use client";

import { usePathname } from "next/navigation";
import SessionList from "@/components/session-list";
import ChatCard from "@/components/chat-card";
import { ProjectOverview } from "@/components/project-overview";

export default function ProjectPage() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const projectId = segments[1];

  const sessionId = segments[2] === "chat" ? segments[3] : null;

  const handleChatSelect = (sessionId: string) => {
    window.history.pushState({}, "", `/projects/${projectId}/chat/${sessionId}`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="max-w-60 w-full border-r overflow-y-auto">
        <SessionList projectId={projectId} onSelect={handleChatSelect} />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {sessionId ? (
          <div className="flex-1 py-4 px-4">
            <ChatCard sessionId={sessionId} />
          </div>
        ) : (
          <ProjectOverview projectId={projectId} />
        )}
      </div>
    </div>
  );
}
