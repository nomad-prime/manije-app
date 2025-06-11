"use client";

import { useProject } from "@/hooks/use-project";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {NextJobs} from "@/components/next-jobs";

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

  return (
    <div className="px-10 pt-10 max-w-3xl">
      <motion.h1
        className="text-3xl font-bold text-foreground mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {project.name}
      </motion.h1>
      <p className="text-muted-foreground mb-10 leading-relaxed">
        {project.description}
      </p>

      <motion.h2
        className="text-2xl font-semibold mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        What’s next
      </motion.h2>

      {projectId &&
        <div className="flex flex-col sm:flex-row gap-4">
          <NextJobs projectId={projectId} />
        </div>
      }
    </div>
  );
};
