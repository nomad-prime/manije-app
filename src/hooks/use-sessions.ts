import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content?: string;
  parts?: Array<{ type: string; text: string }>;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  created_at?: string;
  timestamp?: string;
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface Session {
  id: string;
  tenant_id: string;
  user_id: string;
  project_id: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  title?: string;
}

const useSessions = (projectId: string | null) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: queryKeys.sessions.all(projectId),
    queryFn: async (): Promise<Session[]> => {
      const response = await fetchWithAuth(`${baseUrl}/projects/${projectId}/sessions`);

      if (!response.ok) {
        throw new Error("Failed to fetch chat sessions");
      }

      return response.json();
    },
  });
};

export default useSessions;
