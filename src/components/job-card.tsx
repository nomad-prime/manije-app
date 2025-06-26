import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import useJobType from "@/hooks/use-job-type";
import useJob from "@/hooks/use-job";
import { JobStage } from "@/components/job-stage";
import JobCardSkeleton from "@/components/job-record-skeleton";
import { notFound } from "next/navigation";
import ReviewJobCard from "@/components/review-job-card";
import ActionJobCard from "@/components/action-job-card";
import ConversationJobCard from "@/components/conversation-job-card";
import { AnimatePresence } from "framer-motion";

const JobCard = ({ jobId }: { jobId: string | null }) => {
  const { data: job, isLoading: isLoadingJob } = useJob({ id: jobId });
  const { data: jobType, isLoading: isLoadingJobType } = useJobType(
    job?.job_type_id || null,
  );

  if (isLoadingJob || isLoadingJobType) return <JobCardSkeleton />;

  if (!job) return notFound();

  return (
    <div className="rounded-lg flex flex-col gap-2 max-w-[840px] mx-auto w-full">
      <div className="sticky top-0 flex flex-row gap-2 p-6 bg-background">
        <div className="flex flex-col gap-1 flex-grow">
          {jobType?.name && <CardTitle>{jobType?.name}</CardTitle>}
          {jobType?.description && (
            <CardDescription>{jobType?.description}</CardDescription>
          )}
        </div>
        {job?.stage && <JobStage stage={job.stage} label />}
      </div>

      <AnimatePresence initial={false}>
          {job.stage === "ready_for_review" && <ReviewJobCard job={job} />}
          {job.stage === "ready_for_actions" && <ActionJobCard job={job} />}
          {(job.stage === "awaiting_user_feedback" || job.stage === "conversing") && (
            <ConversationJobCard job={job} />
          )}
        </AnimatePresence>
    </div>
  );
};

export default JobCard;
