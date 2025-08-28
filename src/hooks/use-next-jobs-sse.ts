import { useState, useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { baseStreamUrl, baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";
import { NextJob } from "@/hooks/use-next-jobs";

export interface UseProjectNextJobsSSEReturn {
  error: string | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  reconnect: () => void;
}

interface SSEEventData {
  type: string;
  next_jobs?: NextJob[];
  timestamp?: string;
}

/**
 * Hook to manage SSE connection for real-time next jobs updates.
 * This hook only manages the SSE connection and updates the React Query cache.
 * Use in combination with useNextJobs hook to get the actual data.
 */
export function useNextJobsSSE(projectId: string): UseProjectNextJobsSSEReturn {
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  const queryClient = useQueryClient();

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelayBase = 1000;

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connectSSE = useCallback(async () => {
    if (!projectId) return;

    cleanup();
    setConnectionStatus('connecting');

    try {
      // EventSource will automatically include cookies for auth
      const eventSource = new EventSource(`${baseStreamUrl}/projects/${projectId}/next-jobs`, {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setConnectionStatus('connected');
        setError(null);
        reconnectAttemptsRef.current = 0;
        console.log('SSE connection established for next jobs, project:', projectId);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: SSEEventData = JSON.parse(event.data);

          if (data.type === 'next_jobs_updated' && data.next_jobs) {
            // Update the React Query cache with new next jobs data
            queryClient.setQueryData<NextJob[]>(
              queryKeys.nextJobs.all(projectId),
              data.next_jobs
            );

            // Also invalidate to trigger any dependent queries
            queryClient.invalidateQueries({
              queryKey: queryKeys.nextJobs.all(projectId),
              refetchType: 'none', // Don't refetch, we just set the data
            });

            console.log('Next jobs updated via SSE:', data.next_jobs.length, 'jobs');
          }
        } catch (err) {
          console.error('Error parsing SSE event:', err);
        }
      };

      eventSource.onerror = (event) => {
        console.error('SSE error:', event);
        setConnectionStatus('error');

        eventSource.close();
        eventSourceRef.current = null;

        // Exponential backoff reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = reconnectDelayBase * Math.pow(2, reconnectAttemptsRef.current);
          reconnectAttemptsRef.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect SSE (attempt ${reconnectAttemptsRef.current})...`);
            connectSSE();
          }, delay);
        } else {
          setError('Connection failed after multiple attempts. Please refresh to try again.');
          setConnectionStatus('disconnected');
          // Fall back to polling by invalidating the cache periodically
          queryClient.invalidateQueries({
            queryKey: queryKeys.nextJobs.all(projectId)
          });
        }
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'SSE connection failed';
      setError(errorMessage);
      setConnectionStatus('error');
      console.error('Error establishing SSE connection:', err);

      // Fall back to regular polling on connection failure
      queryClient.invalidateQueries({
        queryKey: queryKeys.nextJobs.all(projectId)
      });
    }
  }, [projectId, cleanup, queryClient]);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setError(null);
    connectSSE();
  }, [connectSSE]);

  useEffect(() => {
    if (!projectId) return;

    // Start SSE connection for ambient updates
    connectSSE();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [projectId, connectSSE, cleanup]);

  // Ensure cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    error,
    connectionStatus,
    reconnect,
  };
}
