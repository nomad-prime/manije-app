"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { queryKeys } from "@/hooks/cache-keys";
import { baseUrl } from "@/lib/urls";
import type { AgentTask, TaskListResponse, TaskStatus, TaskType } from "@/types/tasks";

interface UseTasksOptions {
  projectId: string | null;
  status?: TaskStatus;
  type?: TaskType;
  refetchInterval?: number;
}

export function useTasks({ projectId, status, type, refetchInterval }: UseTasksOptions) {
  const fetchWithAuth = useAuthFetch();

  return useQuery<AgentTask[]>({
    queryKey: queryKeys.tasks.all(projectId, status, type),
    refetchInterval,
    queryFn: async () => {
      if (!projectId) return [];

      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (type) params.set("type", type);

      const queryString = params.toString();
      const url = `${baseUrl}/projects/${projectId}/tasks${queryString ? `?${queryString}` : ""}`;

      const response = await fetchWithAuth(url);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data: TaskListResponse = await response.json();
      return data.tasks;
    },
    enabled: !!projectId,
  });
}
