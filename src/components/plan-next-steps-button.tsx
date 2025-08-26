"use client";

import { useState } from "react";
import { ManijeButton } from "@/components/ui/manije-button";
import { Sparkles } from "lucide-react";
import useCreateNextJob from "@/hooks/use-create-next-job";
import useTaskStatus from "@/hooks/use-task-status";

interface PlanNextStepsButtonProps {
  projectId: string;
}

export const PlanNextStepsButton = ({ projectId }: PlanNextStepsButtonProps) => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const { mutateAsync: createNextJob, isPending } = useCreateNextJob();
  const { data: taskStatus } = useTaskStatus(taskId);

  const handlePlanNextSteps = async () => {
    try {
      const response = await createNextJob(projectId);
      setTaskId(response.taskId);
    } catch (error) {
      console.error("Failed to plan next steps:", error);
    }
  };

  const isTaskRunning = taskStatus?.state === "pending" || taskStatus?.state === "running";
  const isTaskCompleted = taskStatus?.state === "completed";
  const isTaskFailed = taskStatus?.state === "failed";

  // Don't show button if task is running
  if (isTaskRunning) {
    return null;
  }

  const buttonText = isTaskCompleted || isTaskFailed ? "Replan" : "Plan next steps";

  return (
    <ManijeButton
      variant="outline"
      className="group relative p-2"
      nudge
      onClick={handlePlanNextSteps}
      disabled={isPending}
    >
      <Sparkles className="w-4 h-4" />
      <span>{buttonText}</span>
    </ManijeButton>
  );
};