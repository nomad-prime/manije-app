"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContextPanel } from "@/hooks/use-context-panel";
import ArtifactViewer from "@/components/artifact-viewer";
import TaskDetailCard from "@/components/task-detail-card";
import { Button } from "@/components/ui/button";
import type { ShowAssetOutput, ShowTaskOutput } from "@/types/tools";

interface ContextPanelProps {
  projectId: string;
  onAssetSaved?: (content: string) => void;
}

export default function ContextPanel({ projectId, onAssetSaved }: ContextPanelProps) {
  const { state, hideContext } = useContextPanel();

  return (
    <AnimatePresence>
      {state.type !== "none" && (
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
                {state.type === "asset" ? "Asset" : "Task"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={hideContext}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>

            {state.type === "asset" && (
              <ArtifactViewer
                assetId={(state.data as ShowAssetOutput)?.asset_id ?? null}
                projectId={projectId}
                onAssetSaved={onAssetSaved}
              />
            )}

            {state.type === "task" && (
              <TaskDetailCard task={state.data as ShowTaskOutput} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
