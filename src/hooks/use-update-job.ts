import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

type UpdateJobArgs = {
  output?: Record<string, unknown>
  project_id?: string
};

export default function useUpdateJob(id?: string) {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ output }: UpdateJobArgs) => {
      const url = `${baseUrl}/jobs/${id}`;

      const res = await fetchWithAuth(url, {
        method: "PUT",
        body: JSON.stringify({
          output
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update job");
      }

      return await res.json();
    },
    onSuccess: async () => {
      if (id)
        await queryClient.invalidateQueries({ queryKey: queryKeys.jobs.id(id) });
    },
  });
}
