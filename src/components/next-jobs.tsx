import { Stars } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import useCreateJob from "@/hooks/use-create-job-stream";
import useNextJobs, { NextJob as NextJobType } from "@/hooks/use-next-jobs";
import useJobType from "@/hooks/use-job-type";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export const NextJob = ({ nextJob }: { nextJob: NextJobType }) => {
  const { data: jobType } = useJobType(nextJob.job_type_id);
  const { mutateAsync: createJob } = useCreateJob();
  const handleCreateJob = async () => {
    await createJob({
      job_type_id: nextJob.job_type_id,
    });
  };

  return (
    <CustomButton
      variant="outline"
      className="group relative p-2"
      nudge
      onClick={handleCreateJob}
    >
      <Stars />
      <span>{jobType?.name ?? "Job Prototype"}</span>
    </CustomButton>
  );
};

export const NextJobs = ({ projectId }: { projectId: string }) => {
  const { data: nextJobs, isLoading } = useNextJobs({ projectId });

  // loading state with skeletons <Skeleton className="h-8 w-1/2" />
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-40 rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (!nextJobs || nextJobs.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <motion.span
          className="bg-gradient-to-r from-muted-foreground via-white/80 to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent text-sm"
          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Planning the next move, stay tuned!
        </motion.span>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {nextJobs.map((nextJob) => (
        <NextJob nextJob={nextJob} key={nextJob.id} />
      ))}
    </div>
  );
};
