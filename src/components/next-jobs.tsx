import { JobRequest } from "@/hooks/useJobs";
import useJobType from "@/hooks/useJobType";
import { Stars } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";

export const NextJob = ({ job }: { job: JobRequest }) => {
  const { data: jobType } = useJobType(job.job_type_id);

  return (
    <CustomButton
      variant="outline"
      className="group relative p-2"
    >
      <Stars />
      <span>{jobType?.name ?? "Job Prototype"}</span>
    </CustomButton>
  );
};

export const NextJobs = ({ jobs }: { jobs: JobRequest[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {jobs.map((nextJob: JobRequest) => (
        <NextJob job={nextJob} key={nextJob.job_type_id} />
      ))}
    </div>
  );
};
