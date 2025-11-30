"use client";

import useSessions from "@/hooks/use-sessions";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ShimmerTitle } from "@/components/shimmer-title";
import JobListSkeleton from "@/components/job-list-skeleton";

const SessionList = ({
  projectId,
  onSelect,
}: {
  projectId: string | null;
  onSelect: (sessionId: string) => void;
}) => {
  const { data: sessions, isLoading } = useSessions(projectId);

  if (isLoading) {
    return <JobListSkeleton />;
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        start a conversation <br />
        and let the agent help you!
      </div>
    );
  }

  return (
    <ScrollArea className="max-w-60 border-r">
      <div className="p-2 space-y-2">
        {sessions.map((session) => (
          <Button
            key={session.id}
            variant="ghost"
            className="w-full justify-start text-left hover:bg-muted relative group"
            onClick={() => onSelect(session.id)}
          >
            <span
              className="overflow-hidden whitespace-nowrap text-ellipsis block max-w-[10rem]"
              title={session.title || "New conversation"}
            >
              {session.title || <ShimmerTitle text={"new conversation..."} />}
            </span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SessionList;
