import { Badge } from "@/components/ui/badge";
import { ApprovalButton } from "@/components/approval-button";

type DraftReviewProps = {
  draftAssetId: string;
  projectId: string;
};

export function DraftReview({ draftAssetId, projectId }: DraftReviewProps) {
  return (
    <div className="mt-2 border-t pt-2 space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">Draft Asset</Badge>
        <span className="text-xs text-muted-foreground">{draftAssetId.slice(0, 8)}...</span>
      </div>
      <ApprovalButton assetId={draftAssetId} projectId={projectId} />
    </div>
  );
}
