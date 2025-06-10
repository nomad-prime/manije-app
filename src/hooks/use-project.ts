import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

export interface ProjectDetails {
  id: string;
  name: string;
  description?: string;
}

export function useProject(projectId: string | null) {
  const fetchWithAuth = useAuthFetch();

  return useQuery<ProjectDetails>({
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
