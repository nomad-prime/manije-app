"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import useApproveAsset from "@/hooks/use-approve-asset";

type ApprovalButtonProps = {
  assetId: string;
  projectId: string;
};

export function ApprovalButton({ assetId, projectId }: ApprovalButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending } = useApproveAsset({ assetId, projectId });

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    mutate(undefined, {
      onSettled: () => setConfirming(false),
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={confirming ? "default" : "outline"}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Approving..." : confirming ? "Confirm Approve" : "Approve"}
      </Button>
      {confirming && !isPending && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      )}
    </div>
  );
}
