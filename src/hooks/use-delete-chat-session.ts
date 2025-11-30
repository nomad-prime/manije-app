import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

const useDeleteChatSession = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetchWithAuth(
        `${baseUrl}/chat/sessions/${sessionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete chat session");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chatSessions.all() });
    },
  });
};

export default useDeleteChatSession;