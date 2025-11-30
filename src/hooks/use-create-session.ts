import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { Session } from "@/hooks/use-sessions";

interface CreateSessionParams {
  projectId: string;
}

const useCreateSession = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId }: CreateSessionParams): Promise<Session> => {
      const response = await fetchWithAuth(`${baseUrl}/projects/${projectId}/sessions`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all(variables.projectId) });
    },
  });
};

export default useCreateSession;