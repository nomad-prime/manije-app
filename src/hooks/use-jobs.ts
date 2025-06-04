import { useQuery } from "@tanstack/react-query";
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

export type JobStageType = "pending_classification"
  |"classifying"
  |"validating_input"
  |"awaiting_user_feedback"
  |"ready_for_execution"
  |"processing"
  |"post_processing"
  |"ready_for_review"
  |"ready_for_actions"
  |"started"
  |"failed"
  |"completed"


export interface JobRecord {
  id: string;
  job_type_id: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  output?: Record<string, unknown>;
  title?: string;
  stage: JobStageType;
  error_message?: string;
  project_id?: string;
  actions?: Action[];
}

const useJobs = (projectId: string | null) => {
  const fetchWithAuth = useAuthFetch();
  return useQuery({
    queryKey: queryKeys.jobs.all(projectId),
    queryFn: async (): Promise<JobRecord[]> => {
      const response = await fetchWithAuth(
        `${baseUrl}/jobs/${projectId && projectId != "all" ? `?project_id=${projectId}` : ""}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job types");
      }
      return response.json();
    },
  });
};

export default useJobs;
