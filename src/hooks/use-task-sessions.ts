import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import type { Session } from "@/hooks/use-sessions";

interface UseTaskSessionsOptions {
  projectId: string | null;
  taskId: string | null;
}

const useTaskSessions = ({ projectId, taskId }: UseTaskSessionsOptions) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: queryKeys.sessions.byTask(taskId),
    queryFn: async (): Promise<Session[]> => {
      if (!projectId || !taskId) return [];

      const response = await fetchWithAuth(
        `${baseUrl}/projects/${projectId}/tasks/${taskId}/sessions`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch task sessions");
      }

      const data = await response.json();
      return data.sessions ?? [];
    },
    enabled: !!projectId && !!taskId,
  });
};

export default useTaskSessions;
