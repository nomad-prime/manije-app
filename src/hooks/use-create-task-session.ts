import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import type { Session } from "@/hooks/use-sessions";

interface CreateTaskSessionParams {
  projectId: string;
  taskId: string;
}

const useCreateTaskSession = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, taskId }: CreateTaskSessionParams): Promise<Session> => {
      const response = await fetchWithAuth(`${baseUrl}/projects/${projectId}/sessions`, {
        method: "POST",
        body: JSON.stringify({ task_id: taskId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessions.byTask(variables.taskId),
      });
    },
  });
};

export default useCreateTaskSession;
