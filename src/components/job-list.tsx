"use client";

import "react-resizable/css/styles.css";
import useJobs from "@/hooks/use-jobs";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ShimmerTitle } from "@/components/shimmer-title";
import { JobStage } from "@/components/job-stage";
import JobListSkeleton from "@/components/job-list-skeleton";

const JobList = ({
  projectId,
  onSelect,
}: {
  projectId: string | null;
  onSelect: (jobId: string) => void;
}) => {
  const { data: jobs, isLoading } = useJobs(projectId);

  if (isLoading) {
    return <JobListSkeleton />;
  }

  return (
    <ScrollArea className="max-w-60 border-r">
      <div className="p-2 space-y-2">
        {jobs.map((job) => (
          <Button
            key={job.id}
            variant="ghost"
            className="w-full justify-start text-left hover:bg-muted relative group"
            onClick={() => onSelect(job.id)}
          >
            {job?.stage && <JobStage stage={job.stage} />}
            <span
              className="overflow-hidden whitespace-nowrap text-ellipsis block max-w-[10rem]"
              title={job.title}
            >
              {job.title || <ShimmerTitle />}
            </span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default JobList;
