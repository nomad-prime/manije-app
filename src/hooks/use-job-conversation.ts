"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { JobRecord } from "@/hooks/use-jobs";

interface JobFeedbackArgs {
  job_id: string;
  input: string;
}

export default function useJobConversation() {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ job_id, input }: JobFeedbackArgs): Promise<JobRecord> => {
      const response = await fetchWithAuth(`${baseUrl}/jobs/${job_id}/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const updated: JobRecord = await response.json();

      queryClient.setQueryData(queryKeys.jobs.id(updated.id), updated);

      return updated;
    },
  });
}
