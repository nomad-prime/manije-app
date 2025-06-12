"use client";

import { usePathname } from "next/navigation";
import useCreateJobStream from "@/hooks/use-create-job-stream";
import JobList from "@/components/job-list";
import JobCard from "@/components/job-card";
import FloatingPromptInput from "@/components/floating-prompt-input";
import { ProjectOverview } from "@/components/project-overview";

export default function ProjectPage() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const projectId = segments[1];

  const jobId = segments[2] === "jobs" ? segments[3] : null;

  const { mutateAsync, isPending } = useCreateJobStream();

  const handlePrompt = async (input: string) => {
    const newJob = await mutateAsync({
      data: { input, projectId },
    });

    window.history.pushState(
      {},
      "",
      `/projects/${projectId}/jobs/${newJob.id}`,
    );
  };

  const handleSelect = (jobId: string) => {
    window.history.pushState({}, "", `/projects/${projectId}/jobs/${jobId}`);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background text-foreground font-sans justify-start items">
      <JobList projectId={projectId} onSelect={handleSelect} />
      {jobId && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex-1 overflow-y-auto p-4">
            <JobCard jobId={jobId} />
          </div>
        </div>
      )}
      {!jobId && <ProjectOverview projectId={projectId} />}
      <FloatingPromptInput onSubmit={handlePrompt} disabled={isPending} />
    </div>
  );
}
