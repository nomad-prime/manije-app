"use client";

import { useParams } from "next/navigation";
import useCreateJobStream from "@/hooks/use-create-job-stream";
import JobList from "@/components/job-list";
import JobCard from "@/components/job-card";
import FloatingPromptInput from "@/components/floating-prompt-input";
import { useEffect, useState } from "react";
import { ProjectOverview } from "@/components/project-overview";

export default function ProjectPage() {
  const { slugs } = useParams() as { slugs?: string[] };

  const projectId = slugs?.[0] as string;
  const paramJobId = slugs?.[1] === "jobs" ? slugs?.[2] : null;

  const [jobId, setJobId] = useState<string | null>(paramJobId ?? null);

  useEffect(() => {
    if (paramJobId) {
      setJobId(paramJobId);
    }
  }, [paramJobId]);

  const { mutateAsync, isPending } = useCreateJobStream();

  const handlePrompt = async (input: string) => {
    const newJob = await mutateAsync({
      data: { input, projectId },
    });
    setJobId(newJob.id);
    window.history.pushState(
      {},
      "",
      `/projects/${projectId}/jobs/${newJob.id}`,
    );
  };

  const handleSelect = (jobId: string) => {
    setJobId(jobId);
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
