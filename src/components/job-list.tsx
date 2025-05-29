"use client";

import "react-resizable/css/styles.css";
import useJobs from "@/hooks/use-jobs";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { ShimmerTitle } from "@/components/shimmer-title";

export default function JobList({ projectId }: { projectId: string | null }) {
  const { data: jobs } = useJobs(projectId);

  return (
    <ScrollArea className="max-w-60 border-r">
      <div className="p-2 space-y-2">
        {jobs.map((job) => (
          <Button
            key={job.id}
            variant="ghost"
            className="w-full justify-start text-left hover:bg-muted relative group"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
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
}
