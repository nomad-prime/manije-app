import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "@/lib/urls";

export type ActionArgs = {
  data: unknown;
  action: string;
  job_record_id?: string;
};

export type ActionResult = {
  data: Record<string, unknown>;
  keys: string[];
};

export const useExecuteAction = () => {
  const fetchWithAuth = useAuthFetch();

  return useMutation({
    mutationFn: async ({ data, action, job_record_id }: ActionArgs): Promise<ActionResult> => {
      const url = `${baseUrl}/actions`;

      const res = await fetchWithAuth(url, {
        method: "POST",
        body: JSON.stringify({ action, data, job_record_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to execute action");
      }

      return await res.json();
    },
  });
};
