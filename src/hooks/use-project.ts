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
      const project = await response.json();

      const dataResponse = await fetchWithAuth(`${baseUrl}/projects/${projectId}/extract-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: ["project_name", "project_description"],
        }),
      });

      if (!dataResponse.ok) {
        // throw new Error("Failed to fetch project data");
        return project;
      }
      const data = await dataResponse.json();

      return { ...project, data };
    },
  });
}
