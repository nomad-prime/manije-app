"use client";

import { useState, useCallback, useEffect } from "react";
import { LayoutGroup, motion } from "framer-motion";
import "react-resizable/css/styles.css";
import { JobRecord } from "@/hooks/useJobs";
import JobCard from "@/components/job-card";

const MAX_WIDTH = 600;
const MAX_ZOOM = 2;
const MIN_WIDTH = 300;
const MIN_ZOOM = 0.5;
const ZOOM_STEP = 0.01;

export default function JobGrid({ jobs }: { jobs: JobRecord[] }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeJob, setActiveJob] = useState<JobRecord | null>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      setZoomLevel((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z - e.deltaY * ZOOM_STEP)));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, MIN_WIDTH * zoomLevel));


  return (
    <LayoutGroup>
      <div className="p-6">
        <div className="flex flex-wrap gap-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              layoutId={`tile-${job.id}`}
              onClick={() => setActiveJob(job)}
              className="cursor-pointer"
              style={{
                width,
              }}
            >
              <JobCard job={job} zoomLevel={zoomLevel} />
            </motion.div>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );
}
