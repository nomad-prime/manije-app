import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import type { AgentTask } from "@/types/tasks";

interface UseTaskOptions {
  projectId: string | null;
  taskId: string | null;
}

const useTask = ({ projectId, taskId }: UseTaskOptions) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: queryKeys.tasks.id(taskId),
    queryFn: async (): Promise<AgentTask> => {
      if (!projectId || !taskId) {
        throw new Error("Project ID and Task ID are required");
      }

      const response = await fetchWithAuth(
        `${baseUrl}/projects/${projectId}/tasks/${taskId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }

      return response.json();
    },
    enabled: !!projectId && !!taskId,
  });
};

export default useTask;
