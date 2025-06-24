import {
  Card,
  CardDescription,
  CardHeader,
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

const JobCard = ({ jobId }: { jobId: string | null }) => {
  const { data: job, isLoading: isLoadingJob } = useJob({ id: jobId });
  const { data: jobType, isLoading: isLoadingJobType } = useJobType(
    job?.job_type_id || null,
  );

  if (isLoadingJob || isLoadingJobType) return <JobCardSkeleton />;

  if (!job) return notFound();

  return (
    <Card className="h-full bg-input/30 hover:cursor-auto hover:outline">
      <CardHeader className="flex flex-row gap-2">
        <div className="flex flex-col gap-1 flex-grow">
          {jobType?.name && <CardTitle>{jobType?.name}</CardTitle>}
          {jobType?.description && (
            <CardDescription>{jobType?.description}</CardDescription>
          )}
        </div>
        {job?.stage && <JobStage stage={job.stage} label />}
      </CardHeader>

      {job.stage === "ready_for_review" && <ReviewJobCard job={job} />}
      {job.stage === "ready_for_actions" && <ActionJobCard job={job} />}
      {job.stage === "awaiting_user_feedback" && <ConversationJobCard job={job} />}
    </Card>
  );
};

export default JobCard;
