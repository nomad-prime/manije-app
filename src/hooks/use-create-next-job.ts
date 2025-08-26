import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

interface CreateNextJobResponse {
  taskId: string;
}

const useCreateNextJob = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string): Promise<CreateNextJobResponse> => {
      const response = await fetchWithAuth(`${baseUrl}/projects/${projectId}/next-job`, {
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

export default useCreateNextJob;