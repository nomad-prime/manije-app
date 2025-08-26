import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/cache-keys";
import { baseUrl } from "@/lib/urls";

export interface TaskStatus {
  id: string;
  state: "pending" | "running" | "completed" | "failed";
}

const useTaskStatus = (taskId: string | null) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: queryKeys.taskStatus(taskId),
    queryFn: async (): Promise<TaskStatus> => {
      if (!taskId) {
        throw new Error("Task ID is required");
      }
      
      const response = await fetchWithAuth(`${baseUrl}/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch task status");
      }
      return response.json();
    },
    enabled: !!taskId,
    refetchInterval: (data) => {
      // Stop polling when task is completed or failed
      return data?.state === "completed" || data?.state === "failed" ? false : 2000;
    },
    refetchOnWindowFocus: false,
  });
};

export default useTaskStatus;