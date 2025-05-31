import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { JobRecord } from "@/hooks/use-jobs";
import {useEffect, useRef} from "react";

type JobData = {
  [key: string]: unknown;
};

type SaveJobArgs = {
  data: JobData;
  project_id?: string;
  job_type_id?: string;
};

const DATA_PREFIX = "data: ";
const DATA_PREFIX_LENGTH = DATA_PREFIX.length;

export interface JobRecordEvent extends JobRecord {
  type: "job_created" | "job_updated";
}
export default function useCreateJobStream() {
  const fetchWithAuth = useAuthFetch();
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return useMutation({
    mutationFn: async (args: SaveJobArgs): Promise<JobRecord> => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await fetchWithAuth(`${baseUrl}/jobs`, {
        method: 'POST',
        headers: { 'Accept': 'text/event-stream' },
        body: JSON.stringify(args),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const textStream = response.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TransformStream({
          transform(chunk, controller) {
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith(DATA_PREFIX)) {
                try {
                  const eventData = JSON.parse(line.slice(DATA_PREFIX_LENGTH));
                  controller.enqueue(eventData);
                } catch (error) {
                  console.error('Error parsing SSE event:', error);
                }
              }
            }
          }
        }));

      const reader = textStream.getReader();

      const firstEvent = await reader.read();
      if (firstEvent.done) {
        throw new Error('No events received');
      }

      const firstEventData = firstEvent.value;
      if (firstEventData.type !== 'job_created') {
        throw new Error('First event was not job_created');
      }

      const jobRecord = firstEventData as JobRecordEvent;

      queryClient.setQueryData(
        queryKeys.jobs.id(jobRecord.id),
        jobRecord
      );

      processRemainingEvents(reader, queryClient, jobRecord.id);

      return jobRecord;
    },
  });
}

const processRemainingEvents = async (
  reader: ReadableStreamDefaultReader<JobRecordEvent>,
  queryClient: QueryClient,
  jobId: string
) => {
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const jobRecord = value as JobRecordEvent;

      queryClient.setQueryData(
        queryKeys.jobs.id(jobId),
        jobRecord
      );

      if (value.stage === 'completed' || value.stage === 'failed') {
        reader.cancel();
        queryClient.invalidateQueries({queryKey: queryKeys.jobs.all()});
        break;
      }
    }
  } catch (error) {
    console.error('Error processing remaining events:', error);
  }
};
