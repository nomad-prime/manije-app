"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { readStream } from "@/lib/stream";
import { JobRecordEvent } from "@/hooks/use-create-job-stream";

interface JobFeedbackArgs {
  job_id: string;
  input: string;
}

export default function useJobConversation({
  onDone,
}: {
  onDone?: () => void;
} = {}) {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ job_id, input }: JobFeedbackArgs): Promise<void> => {
      const response = await fetchWithAuth(
        `${baseUrl}/jobs/${job_id}/conversation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      await readStream<JobRecordEvent>(response, {
        onEvent: (event) => {
          queryClient.setQueryData(queryKeys.jobs.id(event.id), event);
        },
        onDone: () => {
          onDone?.();
          queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all() });
        },
      });
    },
  });
}
