"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, CheckCircle } from "lucide-react";
import useAsset from "@/hooks/use-asset";
import useUpdateAsset from "@/hooks/use-update-asset";
import useApproveAsset from "@/hooks/use-approve-asset";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import LlmOutput from "@/components/llm-output";

interface ArtifactViewerProps {
  assetId: string | null;
  projectId: string;
}

export default function ArtifactViewer({ assetId, projectId }: ArtifactViewerProps) {
  const { data: asset, isLoading } = useAsset(assetId ?? null);
  const updateAsset = useUpdateAsset();
  const approveAsset = useApproveAsset({
    assetId: assetId || "",
    projectId,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const originalContent = asset?.content || "";
  const hasChanges = editedContent !== originalContent;
  const isReadOnly = asset?.status === "active";
  const canApprove = asset?.status === "pending_review";

  useEffect(() => {
    if (asset) {
      setEditedContent(asset.content || "");
      setIsEditing(false);
    }
  }, [asset]);

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isEditing && hasChanges) {
        e.preventDefault();
      }
    },
    [isEditing, hasChanges]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  const handleStartEditing = () => {
    if (isReadOnly) return;
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    if (!assetId || !hasChanges) return;

    await updateAsset.mutateAsync({ assetId, content: editedContent });
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setEditedContent(originalContent);
    setIsEditing(false);
  };

  const handleApprove = async () => {
    if (!assetId) return;

    if (isEditing && hasChanges) {
      await updateAsset.mutateAsync({ assetId, content: editedContent });
      setIsEditing(false);
    }

    await approveAsset.mutateAsync();
  };

  if (!assetId) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        No artifact linked to this task yet.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Asset not found.
      </div>
    );
  }

  const isBusy = updateAsset.isPending || approveAsset.isPending;

  return (
    <div className="p-4 overflow-y-auto h-full flex flex-col">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">{asset.title}</h3>
          {asset.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{asset.description}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          {isEditing && hasChanges && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDiscard}
                disabled={isBusy}
              >
                <X className="w-4 h-4 mr-1" />
                Discard
              </Button>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={isBusy}
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
            </>
          )}
          {canApprove && (
            <Button
              size="sm"
              variant="default"
              onClick={handleApprove}
              disabled={isBusy}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="flex-1 w-full p-3 border rounded-lg resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-popover"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          data-testid="artifact-editor"
        />
      ) : (
        <div
          className={`prose prose-sm dark:prose-invert max-w-none flex-1 ${!isReadOnly ? "cursor-text" : ""}`}
          onClick={handleStartEditing}
          data-testid="artifact-rendered"
        >
          <LlmOutput content={originalContent} className="" />
        </div>
      )}
    </div>
  );
}
