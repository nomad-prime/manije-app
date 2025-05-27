import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

export interface Action {
  id: string;
  name: string;
  label: string;
  args: string;
  executed: boolean;
}

export interface JobRequest {
  job_type_id: string;
  data: Record<string, unknown>;
}

export interface JobRecord {
  id: string;
  job_type_id: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  output?: Record<string, unknown>;
  stage?: string;
  post_job_actions?: Action[];
  next_jobs?: JobRequest[];
  error_message?: string;
  project_id?: string;
}

const useJobs = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();
  const { data, ...rest } = useQuery({
    queryKey: queryKeys.jobs.all(),
    queryFn: async (): Promise<JobRecord[]> => {
      const response = await fetchWithAuth(`${baseUrl}/jobs`);
      if (!response.ok) {
        throw new Error("Failed to fetch job types");
      }
      return response.json();
    },
  });

  data?.forEach((job) => {
    queryClient.setQueryData(queryKeys.jobs.id(job.id), job);
  });

  return {
    ...rest,
    data: data ?? [],
  };
};

export default useJobs;
