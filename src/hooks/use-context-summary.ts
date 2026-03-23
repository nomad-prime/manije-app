import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";

interface UseContextSummaryOptions {
  sessionId: string | null;
  context: string | null;
}

const useContextSummary = ({ sessionId, context }: UseContextSummaryOptions) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: ["contextSummary", sessionId, context],
    queryFn: async (): Promise<string> => {
      if (!sessionId || !context) return "";

      const params = new URLSearchParams({ context });
      const response = await fetchWithAuth(
        `${baseUrl}/sessions/${sessionId}/context-summary?${params}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch context summary");
      }

      const data = await response.json();
      return data.summary ?? "";
    },
    enabled: !!sessionId && !!context,
  });
};

export default useContextSummary;
