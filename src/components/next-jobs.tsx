"use client";

import { Stars } from "lucide-react";
import { ManijeButton } from "@/components/ui/manije-button";
import useCreateJob from "@/hooks/use-create-job-stream";
import useNextJobs, { NextJob as NextJobType } from "@/hooks/use-next-jobs";
import useJobType from "@/hooks/use-job-type";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/cache-keys";
import { useNextJobsSSE } from "@/hooks/use-next-jobs-sse";

export const NextJob = ({ nextJob }: { nextJob: NextJobType }) => {
  const { data: jobType } = useJobType(nextJob.job_type_id);
  const { mutateAsync: createJob } = useCreateJob();
  const queryClient = useQueryClient();
  const handleCreateJob = async () => {
    const newJob = await createJob({
      job_type_id: nextJob.job_type_id,
      next_job_id: nextJob.id,
    });
    window.history.pushState(
      {},
      "",
      `/projects/${nextJob.project_id}/jobs/${newJob.id}`,
    );
    queryClient.invalidateQueries({
      queryKey: queryKeys.jobs.all(nextJob.project_id),
    });
  };

  return (
    <ManijeButton
      variant="outline"
      className="group relative p-2"
      nudge
      onClick={handleCreateJob}
    >
      <Stars />
      <span>{jobType?.name ?? "Job Prototype"}</span>
    </ManijeButton>
  );
};

export const NextJobs = ({ projectId }: { projectId: string }) => {
  const { data: nextJobs, isLoading } = useNextJobs({ projectId });
  const { connectionStatus, error } = useNextJobsSSE(projectId);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-40 rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (!nextJobs || nextJobs.length === 0) {
    return null;
  }

  return (
    <div>
      <motion.h2
        className="text-2xl font-semibold mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        What&apos;s next
      </motion.h2>

      <div className="flex flex-wrap gap-2">
        {nextJobs.map((nextJob) => (
          <NextJob nextJob={nextJob} key={nextJob.id} />
        ))}
      </div>

      {connectionStatus === "error" && error && (
        <div className="text-xs text-muted-foreground mt-2">
          Live updates unavailable. Refreshing manually may be required.
        </div>
      )}
    </div>
  );
};
