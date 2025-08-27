import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

interface CreateNextJobsResponse {
  taskId: string;
}

const useCreateNextJobs = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string): Promise<CreateNextJobsResponse> => {
      const response = await fetchWithAuth(`${baseUrl}/projects/${projectId}/next-jobs`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to create next job");
      }

      return response.json();
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nextJobs.all(projectId) });
    },
  });
};

export default useCreateNextJobs;
