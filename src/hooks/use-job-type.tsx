import { baseUrl } from "@/lib/urls";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useQuery } from "@tanstack/react-query";
import { JobType } from "@/components/job-type";
import { queryKeys } from "@/hooks/cache-keys";

export default function useJobType(jobTypeId?: string) {
  const fetchWithAuth = useAuthFetch();

  const { data, ...rest } = useQuery({
    queryKey: queryKeys.jobTypes.id(jobTypeId ?? ""),
    queryFn: async (): Promise<JobType> => {
      const response = await fetchWithAuth(
        `${baseUrl}/system/job-types/${jobTypeId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job types");
      }
      return response.json();
    },
    enabled: !!jobTypeId,
  });

  return {
    ...rest,
    data: data,
  };
}
