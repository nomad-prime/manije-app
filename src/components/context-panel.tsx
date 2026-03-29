"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAssetPanel } from "@/hooks/use-asset-panel";
import { useTaskPanel } from "@/hooks/use-task-panel";
import ArtifactViewer from "@/components/artifact-viewer";
import TaskDetailCard from "@/components/task-detail-card";
import { Button } from "@/components/ui/button";

interface AssetPanelProps {
  projectId: string;
  onAssetSaved?: (content: string) => void;
}

export function AssetPanel({ projectId, onAssetSaved }: AssetPanelProps) {
  const { state, hideAsset } = useAssetPanel();

  return (
    <AnimatePresence>
      {state.assetId !== null && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "40%", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="shrink-0 h-[calc(100vh-4rem)] overflow-hidden bg-surface-container"
        >
          <div className="h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Asset
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={hideAsset}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            <ArtifactViewer
              assetId={state.assetId}
              projectId={projectId}
              onAssetSaved={onAssetSaved}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TaskPanel() {
  const { state, hideTask } = useTaskPanel();

  return (
    <AnimatePresence>
      {state.taskId !== null && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "40%", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="shrink-0 h-[calc(100vh-4rem)] overflow-hidden bg-surface-container"
        >
          <div className="h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Task
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={hideTask}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
            {state.data && <TaskDetailCard task={state.data} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
