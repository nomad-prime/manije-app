import { JobRequest } from "@/hooks/use-jobs";
import useJobType from "@/hooks/use-job-type";
import { Stars } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import useCreateJob from "@/hooks/use-create-job";
import {useProject} from "@/components/project-context";

export const NextJob = ({ jobRequest }: { jobRequest: JobRequest }) => {
  const { currentProjectId } = useProject();
  const { data: jobType } = useJobType(jobRequest.job_type_id);
  const {  mutateAsync: createJob } = useCreateJob();
  const handleCreateJob = async () => {
    await createJob({
      data: jobRequest.data,
      project_id: currentProjectId ?? undefined,
      job_type_id: jobRequest.job_type_id,
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

export const NextJobs = ({ jobs }: { jobs: JobRequest[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {jobs.map((nextJob: JobRequest) => (
        <NextJob jobRequest={nextJob} key={nextJob.job_type_id} />
      ))}
    </div>
  );
};
