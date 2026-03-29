"use client";

import { FileText, ListChecks, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { useAssets } from "@/hooks/use-assets";
import { useAssetPanel } from "@/hooks/use-asset-panel";
import { useTaskPanel } from "@/hooks/use-task-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { AgentTask } from "@/types/tasks";
import type { ProjectAsset } from "@/hooks/use-asset";

interface ProjectDashboardProps {
  projectId: string;
}

function StatCard({ label, count, icon: Icon }: { label: string; count: number; icon: React.ElementType }) {
  return (
    <div className="p-4 rounded-xl bg-surface-container-high">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold">{count}</div>
    </div>
  );
}

function AssetItem({ asset }: { asset: ProjectAsset }) {
  const { showAsset } = useAssetPanel();

  return (
    <button
      onClick={() =>
        showAsset(asset.id, {
          asset_id: asset.id,
          title: asset.title,
          description: asset.description,
          content: asset.content,
          status: asset.status,
          type: asset.type,
        })
      }
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors text-left"
    >
      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{asset.title}</div>
        {asset.description && (
          <div className="text-xs text-muted-foreground truncate">{asset.description}</div>
        )}
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        asset.status === "pending_review"
          ? "bg-yellow-400/10 text-yellow-600 dark:text-yellow-400"
          : "bg-green-400/10 text-green-600 dark:text-green-400"
      }`}>
        {asset.status === "pending_review" ? "Review" : "Active"}
      </span>
    </button>
  );
}

function TaskItem({ task }: { task: AgentTask }) {
  const { showTask } = useTaskPanel();

  const statusIcons: Record<string, React.ElementType> = {
    in_progress: Clock,
    completed: CheckCircle,
    failed: AlertCircle,
  };
  const StatusIcon = statusIcons[task.status] || Clock;

  return (
    <button
      onClick={() =>
        showTask(task.id, {
          task_id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          type: task.type,
          asset_id: task.asset_id ?? undefined,
        })
      }
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors text-left"
    >
      <StatusIcon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{task.title || task.description}</div>
      </div>
      <span className="text-xs text-muted-foreground">{task.status.replace("_", " ")}</span>
    </button>
  );
}

export default function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const { data: tasks, isLoading: tasksLoading } = useTasks({
    projectId,
    type: "follow_up",
    refetchInterval: 10_000,
  });
  const { data: assets, isLoading: assetsLoading } = useAssets({
    projectId,
    status: "pending_review",
    refetchInterval: 10_000,
  });

  if (tasksLoading || assetsLoading) {
    return (
      <div className="p-6 space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  const allTasks = tasks ?? [];
  const pendingAssets = assets ?? [];
  const activeTasks = allTasks.filter((t) => t.status === "in_progress" || t.status === "claimed");
  const completedTasks = allTasks.filter((t) => t.status === "completed");
  const failedTasks = allTasks.filter((t) => t.status === "failed");

  return (
    <div className="p-6 max-w-3xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">Project Health</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Pending Review" count={pendingAssets.length} icon={FileText} />
          <StatCard label="Tasks Active" count={activeTasks.length} icon={ListChecks} />
          <StatCard label="Completed" count={completedTasks.length} icon={CheckCircle} />
        </div>
      </div>

      {pendingAssets.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Needs Your Review
          </h3>
          <div className="space-y-1 rounded-xl bg-surface-container p-2">
            {pendingAssets.map((asset) => (
              <AssetItem key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      )}

      {failedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Failed Tasks
          </h3>
          <div className="space-y-1 rounded-xl bg-surface-container p-2">
            {failedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {activeTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            In Progress
          </h3>
          <div className="space-y-1 rounded-xl bg-surface-container p-2">
            {activeTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Recently Completed
          </h3>
          <div className="space-y-1 rounded-xl bg-surface-container p-2">
            {completedTasks.slice(0, 5).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
