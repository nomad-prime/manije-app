import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { JobRecord } from "@/hooks/use-jobs";
import { readStream } from "@/lib/stream";

type JobData = {
  [key: string]: unknown;
};

type CreateJobArgs = {
  next_job_id?: string;
  data?: JobData;
  project_id?: string;
  job_type_id?: string;
};

type JobRecordEventType = "job_created" | "job_updated";

export interface JobRecordEvent extends JobRecord {
  type: JobRecordEventType;
}

export default function useCreateJobStream() {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: CreateJobArgs): Promise<JobRecord> => {
      let response;
      if (args.next_job_id)
        response = await fetchWithAuth(
          `${baseUrl}/jobs/next/${args.next_job_id}`,
          {
            method: "POST",
            headers: { Accept: "text/event-stream" },
          },
        );
      else
        response = await fetchWithAuth(`${baseUrl}/jobs`, {
          method: "POST",
          headers: { Accept: "text/event-stream" },
          body: JSON.stringify(args),
        });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      return await readStream<JobRecordEvent>(
        response,
        {
          onEvent: (event) => {
            queryClient.setQueryData<JobRecord>(
              queryKeys.jobs.id(event.id),
              event,
            );
          },
          onDone: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
          },
          createEventName: "job_created",
        }
      );
    },
  });
}
