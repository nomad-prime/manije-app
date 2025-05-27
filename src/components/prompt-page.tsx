"use client";

import PromptInput from "@/components/prompt-input";
import useCreateJob from "@/hooks/use-create-job";
import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import useJobs from "@/hooks/use-jobs";
import { Loader2 } from "lucide-react";
import JobList from "@/components/job-list";

export default function PromptPage() {
  const [mode, setMode] = useState<"initial" | "list">("initial");

  const { mutateAsync, isPending } = useCreateJob();
  const { data: jobs, isLoading } = useJobs();

  const createJob = async (prompt: string) => {
    try {
      await mutateAsync({ data: { input: prompt } });
      setMode("list");
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (jobs?.length === 0) setMode("initial");
    else setMode("list");
  }, [isLoading, jobs]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        {mode === "initial" && (
          <div className="flex flex-row items-center justify-center gap-8 h-full">
            <motion.div layoutId="prompt">
              <PromptInput onSubmit={createJob} disabled={isPending} />
            </motion.div>
          </div>
        )}
        {mode === "list" && (
          <div className="h-full flex flex-col ">
            <div className="flex-1 overflow-y-auto flex flex-col pb-[120px] ">
              {jobs && jobs.length > 0 && <JobList jobs={jobs}/>}
            </div>
            <motion.div
              layoutId="prompt"
              className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10"
            >
              <PromptInput onSubmit={createJob} disabled={isPending}/>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
