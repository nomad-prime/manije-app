import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

type Job = {
  input: string;
}

type SaveJobArgs = {
  data: Job;
};

export default function useCreateJob() {
  const fetchWithAuth = useFetchWithAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: SaveJobArgs) => {
      const url = `${baseUrl}/jobs`;

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            input: data.input,
          }
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
