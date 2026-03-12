import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

const useApproveAsset = ({
  assetId,
  projectId,
}: {
  assetId: string;
  projectId: string;
}) => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const url = `${baseUrl}/assets/${assetId}/approve`;

      const res = await fetchWithAuth(url, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to approve asset");
      }

      return await res.json();
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.tasks.all(projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessions.all(projectId),
        }),
      ]);
    },
  });
};

export default useApproveAsset;
