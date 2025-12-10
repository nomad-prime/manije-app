"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ProjectAsset {
  title: string;
  description: string;
  type: string;
  data?: {
    priority?: string;
    estimated_hours?: number;
    dependencies?: string[];
    [key: string]: unknown;
  };
}

interface AssetReviewCardProps {
  asset: ProjectAsset;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onEdit?: (changes: Record<string, unknown>) => void;
}

export function AssetReviewCard({
  asset,
  onApprove,
  onReject,
}: AssetReviewCardProps) {
  const [mode, setMode] = useState<"review" | "reject">("review");
  const [rejectReason, setRejectReason] = useState("");

  const handleReject = () => {
    if (mode === "review") {
      setMode("reject");
    } else {
      if (rejectReason.trim()) {
        onReject(rejectReason);
      }
    }
  };

  const handleCancel = () => {
    setMode("review");
    setRejectReason("");
  };

  return (
    <Card className="max-w-[80%] border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{asset.title}</CardTitle>
            <CardDescription className="mt-1">
              {asset.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pb-2">{JSON.stringify(asset.data)}</div>
        {mode === "reject" ? (
          <div className="space-y-3">
            <Textarea
              placeholder="Provide a reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleReject}
                variant="destructive"
                size="sm"
                disabled={!rejectReason.trim()}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Confirm Rejection
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button onClick={onApprove} variant="default" size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button onClick={handleReject} variant="outline" size="sm">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
