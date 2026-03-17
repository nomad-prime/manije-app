import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

export interface ProjectAsset {
  id: string;
  project_id: string;
  session_id?: string;
  tenant_id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  status: string;
  tool_call_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

const useAsset = (assetId: string | null) => {
  const fetchWithAuth = useAuthFetch();

  return useQuery({
    queryKey: queryKeys.assets.id(assetId),
    queryFn: async (): Promise<ProjectAsset> => {
      if (!assetId) {
        throw new Error("Asset ID is required");
      }

      const response = await fetchWithAuth(`${baseUrl}/assets/${assetId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch asset");
      }

      return response.json();
    },
    enabled: !!assetId,
  });
};

export default useAsset;
