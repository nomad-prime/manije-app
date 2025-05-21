import { useQuery } from "@tanstack/react-query";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { baseUrl } from "@/lib/urls";

export interface Action {
  id: string;
  name: string;
  label: string;
  args: string;
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
}

const useJobs = ({ enabled }: { enabled: boolean }) => {
  const fetchWithAuth = useFetchWithAuth();
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<JobRecord[]> => {
      const response = await fetchWithAuth(`${baseUrl}/jobs`);
      if (!response.ok) {
        throw new Error("Failed to fetch job types");
      }
      return response.json();
    },
    enabled: enabled,
  });
};

export default useJobs;
