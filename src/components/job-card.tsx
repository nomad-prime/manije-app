import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useJobType from "@/hooks/use-job-type";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useEffect, useState } from "react";
import useUpdateJob from "@/hooks/use-update-job";
import { CustomTextarea } from "@/components/ui/custom-textarea";
import useJob from "@/hooks/use-job";
import { JobStage } from "@/components/job-stage";
import JobCardSkeleton from "@/components/Job-Record-Skeleton";
import JobReview from "@/components/job-review";
import { notFound, useRouter } from "next/navigation";
import PostJobActions from "@/components/post-job-actions";
import { ActionOutcome, useExecuteAction } from "@/hooks/use-execute-action";
import { Action } from "@/hooks/use-jobs";
import { toast } from "sonner";

const JobCard = ({ jobId }: { jobId: string | null }) => {
  const { data: job, isLoading: isLoadingJob } = useJob({ id: jobId });
  const { data: jobType, isLoading: isLoadingJobType } = useJobType(
    job?.job_type_id || null,
  );

  const { push } = useRouter();

  const { mutate: updateJobRecord } = useUpdateJob(job?.id);
  const { mutate: executeAction } = useExecuteAction({
    onSuccess: (outcome: ActionOutcome) => {
      toast.success(outcome.message);
      if (outcome.redirect_to) {
        push(outcome.redirect_to);
      }
    },
  });

  const output = job?.output ?? {};

  const [data, setData] = useState(output);

  useEffect(() => {
    if (job?.output) {
      setData(job.output);
    }
  }, [job?.output]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    updateJobRecord({ output: data });
  };

  const handleActionClick = (action: Action) => {
    if (!job?.id) return;
    executeAction({
      id: action.id,
      job_record_id: job.id,
    });
  };

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

      {job?.stage === "ready_for_review" && (
        <>
          <CardContent className="flex flex-col gap-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2 h-full">
                <Label htmlFor={`output-${key}`} className="mt-2">
                  {key}
                </Label>
                <CustomTextarea
                  id={`output-${key}`}
                  name={key}
                  className="resize-none overflow-auto"
                  value={
                    typeof value === "string" ? value : JSON.stringify(value)
                  }
                  onChange={handleChange}
                  onBlur={handleSave}
                />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-end gap-4 px-6 pb-4">
            <JobReview job={job} />
          </CardFooter>
        </>
      )}
      {job?.stage === "ready_for_actions" && (
        <>
          <CardContent className="flex flex-col gap-2">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2 h-full">
                <Label
                  htmlFor={`output-${key}`}
                  className="mt-2 text-muted-foreground"
                >
                  {key}
                </Label>
                <p className="resize-none overflow-auto text-sm border px-3 py-3 rounded-lg text-justify">
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </p>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-end gap-4 px-6 pb-4">
            <PostJobActions
              actions={job.actions || []}
              onActionClick={handleActionClick}
            />
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default JobCard;
