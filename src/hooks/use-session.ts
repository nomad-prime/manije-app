import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { Session } from "@/hooks/use-sessions";

const useSession = (sessionId: string | null) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: queryKeys.sessions.id(sessionId),
    queryFn: async (): Promise<Session> => {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await fetchWithAuth(
        `${baseUrl}/sessions/${sessionId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chat session");
      }

      return response.json();
    },
    enabled: !!sessionId,
  });
};

export default useSession;
