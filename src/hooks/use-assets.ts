"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import type { ProjectAsset } from "@/hooks/use-asset";

interface UseAssetsOptions {
  projectId: string | null;
  refetchInterval?: number;
}

export function useAssets({ projectId, refetchInterval }: UseAssetsOptions) {
  const fetchWithAuth = useAuthFetch();

  return useQuery<ProjectAsset[]>({
    queryKey: queryKeys.assets.all(projectId),
    refetchInterval,
    queryFn: async () => {
      if (!projectId) return [];

      const response = await fetchWithAuth(`${baseUrl}/projects/${projectId}/assets`);
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }

      const data = await response.json();
      return data.assets ?? data;
    },
    enabled: !!projectId,
  });
}
