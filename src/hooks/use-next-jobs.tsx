import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/cache-keys";
import { baseUrl } from "@/lib/urls";

export interface NextJob {
  id: string;
  project_id: string;
  job_record_id: string;
  job_type_id: string;
}

const useNextJobs = ({ projectId }: { projectId: string }) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: queryKeys.nextJobs.all(projectId),
    queryFn: async (): Promise<NextJob[]> => {
      const response = await fetchWithAuth(
        `${baseUrl}/project/${projectId}/next-jobs`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch next jobs");
      }
      return response.json();
    },
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
  });
};

export default useNextJobs;
