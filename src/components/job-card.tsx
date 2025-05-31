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

const JobCard = ({ jobId }: { jobId: string | null }) => {
  const { data: job, isLoading: isLoadingJob } = useJob({ id: jobId });
  const { data: jobType, isLoading: isLoadingJobType } = useJobType(job?.job_type_id || null);
  const { mutate: updateJobRecord } = useUpdateJob(job?.id);

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

  if (isLoadingJob || isLoadingJobType) return <JobCardSkeleton />;

  return (
    <Card className="h-full bg-input/30 hover:cursor-auto hover:outline">
      <CardHeader>
        {jobType?.name && <CardTitle>{jobType?.name}</CardTitle>}
        {jobType?.description && (
          <CardDescription>{jobType?.description}</CardDescription>
        )}
      </CardHeader>

      {job?.stage === "completed" && (
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
      )}
      <CardFooter className="flex flex-col items-end gap-4 px-6 pb-4">
        {job?.stage && <JobStage stage={job.stage} label />}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
