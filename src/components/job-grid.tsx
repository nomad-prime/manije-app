"use client";

import { LayoutGroup, motion } from "framer-motion";
import "react-resizable/css/styles.css";
import { JobRecord } from "@/hooks/use-jobs";
import JobCard from "@/components/job-card";

export default function JobGrid({ jobs }: { jobs: JobRecord[] }) {

  return (
    <LayoutGroup>
      <div className="p-6 h-full">
        <div className="flex flex-wrap gap-4 h-full">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layoutId={`tile-${job.id}`}
              className="cursor-pointer h-full"
            >
              <JobCard jobId={job.id} />
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
