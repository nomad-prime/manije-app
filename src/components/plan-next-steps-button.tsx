"use client";

import { useState } from "react";
import { ManijeButton } from "@/components/ui/manije-button";
import { Sparkles } from "lucide-react";
import useCreateNextJobs from "@/hooks/use-create-next-jobs";
import useTaskStatus from "@/hooks/use-task-status";
import useNextJobs from "@/hooks/use-next-jobs";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/cache-keys";

interface PlanNextStepsButtonProps {
  projectId: string;
}

export const PlanNextStepsButton = ({ projectId }: PlanNextStepsButtonProps) => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { mutateAsync: createNextJob, isPending } = useCreateNextJobs();
  const { data: nextJobs } = useNextJobs({ projectId });
  const { isTaskRunning, isTaskCompleted, isTaskFailed } = useTaskStatus(taskId, {
    onSuccess: (data) => {
        console.log("Next steps planning completed:", data);
      if (data.state === "completed") {
        queryClient.invalidateQueries({ queryKey: queryKeys.nextJobs.all(projectId) });
      }
    },
  });

  const handlePlanNextSteps = async () => {
    try {
      const response = await createNextJob(projectId);
      console.log("Plan next steps response:", response);
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
