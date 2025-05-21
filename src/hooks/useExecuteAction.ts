import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "@/lib/urls";

type ActionArgs = {
  data: unknown;
  action: string;
};

export const useExecuteAction = () => {
  const fetchWithAuth = useFetchWithAuth();

  return useMutation({
    mutationFn: async ({ data, action }: ActionArgs) => {
      const url = `${baseUrl}/actions`;

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, data }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to execute action");
      }

      return await res.json();
    },
  });
};
