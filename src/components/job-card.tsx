import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useJobType from "@/hooks/use-job-type";
import PostJobActions from "@/components/post-job-actions";
import { NextJobs } from "@/components/next-jobs";
import { Label } from "@/components/ui/label";
import {ChangeEvent, useEffect, useState} from "react";
import useUpdateJob from "@/hooks/use-update-job";
import { useExecuteAction } from "@/hooks/use-execute-action";
import { CustomTextarea } from "@/components/ui/custom-textarea";
import { useCurrentProject } from "@/components/project-context";
import useJob from "@/hooks/use-job";
import { Action } from "@/hooks/use-jobs";

const JobCard = ({ jobId }: { jobId: string | null }) => {
  const { data: job } = useJob({ id: jobId });
  const { currentProjectId, setCurrentProjectId } = useCurrentProject();
  const { data: jobType } = useJobType(job?.job_type_id);
  const { mutate: updateJobRecord } = useUpdateJob(job?.id);
  const { mutateAsync: executeAction } = useExecuteAction();

  const output = job?.output ?? {};
  const nextJobs = job?.next_jobs ?? [];
  const postJobActions = job?.post_job_actions ?? [];

  const [executingActions, setExecutingActions] = useState<string[]>([]);

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

  const handleActionClick = async (action: Action) => {
    setExecutingActions((prevActions) => [...prevActions, action.name]);
    await handleSave();
    try {
      await executeAction({
        action: action.name,
        data: output,
        job_record_id: job?.id,
      });
    } catch (error) {
      console.error("Error executing action:", error);
    } finally {
      setExecutingActions((prevActions) =>
        prevActions.filter((a) => a !== action.name),
      );
      if (!currentProjectId && job?.project_id) {
        setCurrentProjectId(job?.project_id);
      }
    }
  };

  const handleSave = async () => {
    updateJobRecord({ output: data });
  };

  return (
    <Card className="h-full bg-input/30 hover:cursor-auto hover:outline">
      <CardHeader>
        {jobType?.name && <CardTitle>{jobType?.name}</CardTitle>}
        {jobType?.description && (
          <CardDescription>{jobType?.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-2 h-full">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2 h-full">
            <Label htmlFor={`output-${key}`} className="mt-2">
              {key}
            </Label>
            <CustomTextarea
              id={`output-${key}`}
              name={key}
              className="resize-none overflow-auto flex-grow"
              value={typeof value === "string" ? value : JSON.stringify(value)}
              onChange={handleChange}
              onBlur={handleSave}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 px-4 pb-4">
        <p className="text-sm text-muted-foreground">{job?.stage}</p>

        {postJobActions.length > 0 && (
          <PostJobActions
            actions={postJobActions}
            executingActions={executingActions}
            onActionClick={handleActionClick}
          />
        )}

        {nextJobs.length > 0 && <NextJobs jobs={nextJobs} data={data} />}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
