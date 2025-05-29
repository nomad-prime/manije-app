import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

export type ActionArgs = {
  data: unknown;
  action: string;
  job_record_id?: string;
};

export type ActionResult = {
  data: Record<string, unknown>;
  job_record_id?: string;
  keys: string[];
};

export const useExecuteAction = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      action,
      job_record_id,
    }: ActionArgs): Promise<ActionResult> => {
      const url = `${baseUrl}/actions`;

      const res = await fetchWithAuth(url, {
        method: "POST",
        body: JSON.stringify({ action, data, job_record_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to execute action");
      }

      const response = await res.json();
      return {
        ...response,
        job_record_id: job_record_id,
      };
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.projects.all(),
      });
      if (result?.job_record_id)
        await queryClient.invalidateQueries({
          queryKey: queryKeys.jobs.id(result.job_record_id),
        });
    },
  });
};
