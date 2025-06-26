"use client";

import { usePathname } from "next/navigation";
import JobList from "@/components/job-list";
import JobCard from "@/components/job-card";
import { ProjectOverview } from "@/components/project-overview";

export default function ProjectPage() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const projectId = segments[1];

  const jobId = segments[2] === "jobs" ? segments[3] : null;


  const handleSelect = (jobId: string) => {
    window.history.pushState({}, "", `/projects/${projectId}/jobs/${jobId}`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="max-w-60 w-full border-r overflow-y-auto">
        <JobList projectId={projectId} onSelect={handleSelect}/>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        {jobId ? (
          <div className="flex-1 py-4 px-4">
            <JobCard jobId={jobId}/>
          </div>
        ) : (
          <ProjectOverview projectId={projectId}/>
        )}
      </div>
    </div>
  );
}
