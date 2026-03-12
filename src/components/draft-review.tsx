import { Badge } from "@/components/ui/badge";
import { ApprovalButton } from "@/components/approval-button";

type DraftReviewProps = {
  draftAssetId: string;
  projectId: string;
  sessionId?: string;
};

export function DraftReview({ draftAssetId, projectId, sessionId }: DraftReviewProps) {
  return (
    <div className="mt-2 border-t pt-2 space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Draft Asset</Badge>
        <span className="text-xs text-muted-foreground">{draftAssetId.slice(0, 8)}...</span>
        {sessionId && (
          <a
            href={`/projects/${projectId}/sessions/${sessionId}`}
            className="text-xs text-blue-600 hover:underline"
          >
            Open chat session
          </a>
        )}
      </div>
      <ApprovalButton assetId={draftAssetId} projectId={projectId} />
    </div>
  );
}
