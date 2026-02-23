import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DraftReview } from "@/components/draft-review";
import type { AgentTask } from "@/types/tasks";

type TaskCardProps = {
  task: AgentTask;
};

const statusColors: Record<string, string> = {
  unclaimed: "bg-gray-100 text-gray-800",
  claimed: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};

const typeLabels: Record<string, string> = {
  genesis: "Genesis",
  follow_up: "Follow-up",
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{typeLabels[task.type] || task.type}</Badge>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status] || ""}`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>
      <p className="text-sm">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {task.claimed_by && <span>Claimed by: {task.claimed_by}</span>}
        <span>{new Date(task.created_at).toLocaleDateString()}</span>
      </div>
      {task.draft_asset_id && (
        <DraftReview
          draftAssetId={task.draft_asset_id}
          sessionId={task.session_id}
          projectId={task.project_id}
        />
      )}
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-2 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
