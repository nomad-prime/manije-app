import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { Project } from "@/hooks/use-projects";

const useCreateProject = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<Project> => {
      const response = await fetchWithAuth(`${baseUrl}/projects/`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all() });
    },
  });
};

export default useCreateProject;