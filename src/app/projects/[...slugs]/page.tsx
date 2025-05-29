"use client";

import { useParams, useRouter } from "next/navigation";
import useCreateJob from "@/hooks/use-create-job";
import JobList from "@/components/job-list";
import JobCard from "@/components/job-card";
import FloatingPromptInput from "@/components/floating-prompt-input";

export default function ProjectPage() {
  const router = useRouter();
  const { slugs } = useParams() as { slugs?: string[] };

  const projectId = slugs?.[0] as string;
  const jobId = slugs?.[1] === "jobs" ? slugs?.[2] : null;

  const { mutateAsync, isPending } = useCreateJob();

  const handlePrompt = async (input: string) => {
    const newJob = await mutateAsync({
      data: { input, projectId },
    });
    router.push(`/projects/${projectId}/jobs/${newJob.id}`);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background text-foreground font-sans justify-start items">
      <JobList projectId={projectId} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <JobCard jobId={jobId} />
        </div>
        <FloatingPromptInput onSubmit={handlePrompt} disabled={isPending} />
      </div>
    </div>
  );
}
