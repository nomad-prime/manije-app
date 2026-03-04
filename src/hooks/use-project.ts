import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { Project } from "@/hooks/use-projects";

export function useProject(projectId: string | null) {
  const fetchWithAuth = useAuthFetch();

  return useQuery<Project>({
    queryKey: queryKeys.projects.id(projectId),
    enabled: !!projectId,
    queryFn: async () => {
      const response = await fetchWithAuth(`${baseUrl}/projects/${projectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project details");
      }
      return response.json();
    },
  });
}
