import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "@/lib/urls";

export type ActionArgs = {
  id: string;
  job_record_id: string;
};

export type ActionOutcome = {
  message: string;
  redirect_to?: string;
  context?: Record<string, unknown>;
};

export const useExecuteAction = (config?: {
  onSuccess?: (result: ActionOutcome) => void;
  onError?: (error: Error) => void;
}) => {
  const fetchWithAuth = useAuthFetch();

  return useMutation<ActionOutcome, Error, ActionArgs>({
    mutationFn: async ({
      id,
      job_record_id,
    }: ActionArgs): Promise<ActionOutcome> => {
      const url = `${baseUrl}/jobs/${job_record_id}/actions/${id}`;

      const res = await fetchWithAuth(url, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to execute action");
      }

      return await res.json();
    },
    onSuccess: config?.onSuccess,
    onError: config?.onError,
  });
};
