"use client";

import { LayoutGroup, motion } from "framer-motion";
import "react-resizable/css/styles.css";
import { JobRecord } from "@/hooks/use-jobs";
import JobCard from "@/components/job-card";

export default function JobList({ jobs }: { jobs: JobRecord[] }) {
  return (
    <LayoutGroup>
      <div className="p-6">
        <div className="flex flex-wrap gap-4 h-full justify-center items-start lg:justify-start">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layoutId={`tile-${job.id}`}
              className="cursor-pointer h-full min-w-[400px] max-w-md md:max-w-2xl lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl flex-1"
            >
              <JobCard jobId={job.id} />
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
