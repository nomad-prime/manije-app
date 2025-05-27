import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

type JobData = {
  [key: string]: unknown;
}

type SaveJobArgs = {
  data: JobData;
  project_id?: string;
  job_type_id?: string;
};

export default function useCreateJob() {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: SaveJobArgs) => {
      const url = `${baseUrl}/jobs`;

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: args.data,
          project_id: args.project_id,
          job_type_id: args.job_type_id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send job");
      }

      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
    },
  });
}
