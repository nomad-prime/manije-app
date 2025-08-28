"use client";

import { useState } from "react";
import { ManijeButton } from "@/components/ui/manije-button";
import { Sparkles } from "lucide-react";
import useCreateNextJobs from "@/hooks/use-create-next-jobs";
import useTaskStatus from "@/hooks/use-task-status";
import useNextJobs from "@/hooks/use-next-jobs";

interface PlanNextStepsButtonProps {
  projectId: string;
}

export const PlanNextStepsButton = ({ projectId }: PlanNextStepsButtonProps) => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const { mutateAsync: createNextJobs, isPending } = useCreateNextJobs();
  const { data: nextJobs } = useNextJobs({ projectId });
  const { isTaskRunning, isTaskCompleted, isTaskFailed } = useTaskStatus(taskId);

  const handlePlanNextSteps = async () => {
    try {
      const response = await createNextJobs(projectId);
      setTaskId(response.taskId);
    } catch (error) {
      console.error("Failed to plan next steps:", error);
    }
  };

  const hasExistingNextJobs = nextJobs && nextJobs.length > 0;

  const getButtonText = () => {
    if (isPending || isTaskRunning) return "Planning...";
    if (isTaskCompleted || isTaskFailed || hasExistingNextJobs) return "Replan";
    return "Plan next steps";
  };

  return (
    <ManijeButton
      variant="secondary"
      className="group relative"
      nudge
      onClick={handlePlanNextSteps}
      disabled={isPending || isTaskRunning}
    >
      <Sparkles className={`w-4 h-4 ${(isPending || isTaskRunning) ? 'animate-pulse' : ''}`} />
      <span>{getButtonText()}</span>
    </ManijeButton>
  );
};
