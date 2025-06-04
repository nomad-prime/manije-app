import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

const useAcceptJob = ({ jobId }: { jobId: string }) => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const url = `${baseUrl}/jobs/${jobId}/accept`;

      const res = await fetchWithAuth(url, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to accept job");
      }

      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.id(jobId),
      });
    },
  });
};

export default useAcceptJob;
