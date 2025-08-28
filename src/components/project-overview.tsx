"use client";

import { useProject } from "@/hooks/use-project";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { NextJobs } from "@/components/next-jobs";
import { PlanNextStepsButton } from "@/components/plan-next-steps-button";

interface ProjectOverviewProps {
  projectId: string | null;
}

export const ProjectOverview = ({ projectId }: ProjectOverviewProps) => {
  const { data: project, isLoading, error } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="px-10 pt-10 space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (error || !project) {
    throw error ?? new Error("Project not found");
  }

  const projectName = (project.data?.["name"] || "Unnamed Project") as string;
  const projectDescription = (project.data?.["description"] ||
    "No description provided.") as string;

  return (
    <div className="px-10 pt-10 max-w-3xl">
      <motion.h1
        className="text-3xl font-bold text-foreground mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {projectName}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-muted-foreground mb-10 leading-relaxed"
      >
        {projectDescription}
      </motion.p>

      {projectId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex-row sm:flex-row space-y-8"
        >
          <NextJobs projectId={projectId} />
          <PlanNextStepsButton projectId={projectId} />
        </motion.div>
      )}
    </div>
  );
};
