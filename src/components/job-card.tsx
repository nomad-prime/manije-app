import { JobRecord } from "@/hooks/useJobs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useJobType from "@/hooks/useJobType";
import PostJobActions from "@/components/post-job-actions";
import { NextJobs } from "@/components/next-jobs";

const JobCard = ({ job, zoomLevel }: { job: JobRecord; zoomLevel: number }) => {
  const { data: jobType } = useJobType(job.job_type_id);
  const titleFontSize = Math.max(10, Math.min(18, 14 * zoomLevel));
  const descriptionFontSize = Math.max(8, Math.min(16, 12 * zoomLevel));
  const contentFontSize = Math.max(6, Math.min(14, 10 * zoomLevel));
  const output = job.output ?? {};
  const nextJobs = job.next_jobs ?? [];
  const postJobActions = job.post_job_actions ?? [];

  const hideContent = zoomLevel < 1;

  return (
    <Card className="w-full h-full bg-input/30 hover:cursor-auto hover:outline">
      <CardHeader>
        <CardTitle
          style={{
            fontSize: `${titleFontSize}px`,
          }}
        >
          {jobType?.name ?? "Job Prototype"}
        </CardTitle>
        <CardDescription
          style={{
            fontSize: `${descriptionFontSize}px`,
          }}
        >
          {jobType?.description ?? "Job Description"}
        </CardDescription>
      </CardHeader>
      {!hideContent && (
        <CardContent
          className="grid gap-2"
          style={{ fontSize: `${contentFontSize}px` }}
        >
          {JSON.stringify(output, null, 2)}
        </CardContent>
      )}
      <CardFooter className="flex flex-col items-start gap-4 px-4 pb-4">
        <p className="text-sm text-muted-foreground">{job.stage}</p>

        {postJobActions.length > 0 && (
          <PostJobActions actions={postJobActions} output={output} />
        )}

        {nextJobs.length > 0 && <NextJobs jobs={nextJobs} />}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
