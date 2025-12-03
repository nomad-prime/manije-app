import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { ChatMessage } from "@/hooks/use-sessions";

const useMessages = (sessionId: string | null) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: queryKeys.sessions.messages(sessionId),
    queryFn: async (): Promise<ChatMessage[]> => {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await fetchWithAuth(
        `${baseUrl}/sessions/${sessionId}/messages`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      return response.json();
    },
    enabled: !!sessionId,
  });
};

export default useMessages;