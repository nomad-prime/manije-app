import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/cache-keys";
import { baseUrl } from "@/lib/urls";

export interface TaskStatus {
  id: string;
  state: "pending" | "running" | "completed" | "failed";
}

interface UseTaskStatusOptions {
  onSuccess?: (data: TaskStatus) => void;
}

const useTaskStatus = (
  taskId: string | null,
  options?: UseTaskStatusOptions,
) => {
  const fetchWithAuth = useAuthFetch();

  const query = useQuery({
    queryKey: queryKeys.taskStatus(taskId),
    queryFn: async (): Promise<TaskStatus> => {
      if (!taskId) {
        throw new Error("Task ID is required");
      }

      const response = await fetchWithAuth(`${baseUrl}/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch task status");
      }
      const json = await response.json();

      options?.onSuccess?.(json as unknown as TaskStatus);

      return json;
    },
    enabled: !!taskId,
    refetchInterval: (query) => {
      // Stop polling when task is completed or failed
      return query.state.data?.state === "completed" ||
        query.state.data?.state === "failed"
        ? false
        : 2000;
    },
    refetchOnWindowFocus: false,
  });

  const isTaskRunning = query.data?.state === "pending" || query.data?.state === "running";
  const isTaskCompleted = query.data?.state === "completed";
  const isTaskFailed = query.data?.state === "failed";

  return {
    ...query,
    isTaskRunning,
    isTaskCompleted,
    isTaskFailed,
  };
};

export default useTaskStatus;
