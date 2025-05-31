import { JobRequest } from "@/hooks/use-jobs";
import useJobType from "@/hooks/use-job-type";
import { Stars } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import useCreateJob from "@/hooks/use-create-job-stream";
import {useCurrentProject} from "@/components/project-context";

export const NextJob = ({ jobRequest, data }: { jobRequest: JobRequest, data: Record<string, unknown> }) => {
  const { currentProjectId } = useCurrentProject();
  const { data: jobType } = useJobType(jobRequest.job_type_id);
  const {  mutateAsync: createJob } = useCreateJob();
  const handleCreateJob = async () => {
    await createJob({
      data,
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

export const NextJobs = ({ jobs, data }: { jobs: JobRequest[], data: Record<string, unknown> }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {jobs.map((nextJobRequest: JobRequest) => (
        <NextJob jobRequest={nextJobRequest} data={data} key={nextJobRequest.job_type_id} />
      ))}
    </div>
  );
};
