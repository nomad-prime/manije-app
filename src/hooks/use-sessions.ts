import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
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

export interface ToolCallRecord {
  id: string;
  tool_name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  error?: string;
  executed_at: string;
}

export interface Session {
  id: string;
  tenant_id: string;
  user_id: string;
  job_id?: string;
  project_id?: string;
  messages: ChatMessage[];
  tool_calls: ToolCallRecord[];
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
