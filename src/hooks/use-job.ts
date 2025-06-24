import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { AnyJobRecord } from "@/hooks/use-jobs";

const useJob = ({ id }: { id: string | null }) => {
  const fetchWithAuth = useAuthFetch();
  const { data, ...rest } = useQuery({
    queryKey: queryKeys.jobs.id(id),
    queryFn: async (): Promise<AnyJobRecord> => {
      const response = await fetchWithAuth(`${baseUrl}/jobs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job types");
      }
      return response.json();
    },
    enabled: !!id,
  });

  return {
    ...rest,
    data,
  };
};

export default useJob;
