import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import type { ProjectAsset } from "@/hooks/use-asset";

interface UpdateAssetParams {
  assetId: string;
  content: string;
}

const useUpdateAsset = () => {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assetId, content }: UpdateAssetParams): Promise<ProjectAsset> => {
      const response = await fetchWithAuth(`${baseUrl}/assets/${assetId}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update asset");
      }

      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assets.id(variables.assetId),
      });
    },
  });
};

export default useUpdateAsset;
