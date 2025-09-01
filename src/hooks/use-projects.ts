import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

type ProjectDataKeys = "project_name" | "project_description";

export interface Project {
  open_jobs: number;
  done_jobs: number;
  id: string;
  data?: Record<ProjectDataKeys, string>;
}

const useProjects = () => {
  const fetchWithAuth = useAuthFetch();
  return useQuery({
    queryKey: queryKeys.projects.all(),
    queryFn: async (): Promise<Project[]> => {
      const response = await fetchWithAuth(`${baseUrl}/projects`);
      if (!response.ok) {
        throw new Error("Failed to fetch job types");
      }
      return response.json();
    },
  });
};

export default useProjects;
