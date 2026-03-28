"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useAssets } from "@/hooks/use-assets";
import { toast } from "sonner";

interface UseNotificationsOptions {
  projectId: string | null;
  onAssetReady?: (assetId: string, title: string) => void;
  onTaskCompleted?: (taskId: string, title: string) => void;
}

export function useNotifications({ projectId, onAssetReady, onTaskCompleted }: UseNotificationsOptions) {
  const { data: tasks } = useTasks({ projectId, type: "follow_up", refetchInterval: 10_000 });
  const { data: assets } = useAssets({ projectId, refetchInterval: 10_000 });

  const prevAssetIds = useRef<Set<string>>(new Set());
  const prevCompletedTaskIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  const handleAssetReady = useCallback((assetId: string, title: string) => {
    toast(`"${title}" is ready for review`, {
      action: onAssetReady
        ? { label: "View", onClick: () => onAssetReady(assetId, title) }
        : undefined,
    });
  }, [onAssetReady]);

  const handleTaskCompleted = useCallback((taskId: string, title: string) => {
    toast(`Task completed: "${title}"`, {
      action: onTaskCompleted
        ? { label: "View", onClick: () => onTaskCompleted(taskId, title) }
        : undefined,
    });
  }, [onTaskCompleted]);

  useEffect(() => {
    if (!assets) return;

    const pendingAssets = assets.filter((a) => a.status === "pending_review");
    const currentIds = new Set(pendingAssets.map((a) => a.id));

    if (!initialized.current) {
      prevAssetIds.current = currentIds;
      initialized.current = true;
      return;
    }

    for (const asset of pendingAssets) {
      if (!prevAssetIds.current.has(asset.id)) {
        handleAssetReady(asset.id, asset.title);
      }
    }

    prevAssetIds.current = currentIds;
  }, [assets, handleAssetReady]);

  useEffect(() => {
    if (!tasks) return;

    const completed = tasks.filter((t) => t.status === "completed");
    const currentIds = new Set(completed.map((t) => t.id));

    if (prevCompletedTaskIds.current.size === 0 && currentIds.size > 0) {
      prevCompletedTaskIds.current = currentIds;
      return;
    }

    for (const task of completed) {
      if (!prevCompletedTaskIds.current.has(task.id)) {
        handleTaskCompleted(task.id, task.title || task.description);
      }
    }

    prevCompletedTaskIds.current = currentIds;
  }, [tasks, handleTaskCompleted]);
}
