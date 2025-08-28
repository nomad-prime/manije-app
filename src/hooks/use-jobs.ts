import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { baseUrl } from "@/lib/urls";
import { queryKeys } from "@/hooks/cache-keys";

export interface Action {
  id: string;
  name: string;
  label: string;
  args: string;
  executed: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export type JobStageType = "pending_classification"
  |"classifying"
  |"validating_input"
  |"awaiting_user_feedback"
  |"ready_for_execution"
  |"processing"
  |"post_processing"
  |"ready_for_review"
  |"ready_for_actions"
  |"conversing"
  |"started"
  |"failed"
  |"completed"


export interface JobRecord {
  id: string;
  job_type_id: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  title?: string;
  error_message?: string;
  project_id: string;
}

export interface ConversationJobRecord extends JobRecord {
  messages: ChatMessage[];
  stage: "awaiting_user_feedback" | "conversing";
}

export interface ReviewJobRecord extends JobRecord {
  output: Record<string, unknown>;
  stage: "ready_for_review";
}

export interface ActionJobRecord extends JobRecord {
  output: Record<string, unknown>;
  actions: Action[];
  stage: "ready_for_actions";
}

interface GenericJobRecord extends JobRecord {
  stage: Exclude<
    JobStageType,
    "ready_for_review" | "ready_for_actions" | "awaiting_user_feedback" | "conversing"
  >;
}


export type AnyJobRecord =
  | GenericJobRecord
  | ConversationJobRecord
  | ReviewJobRecord
  | ActionJobRecord;

const useJobs = (projectId: string | null) => {
  const fetchWithAuth = useAuthFetch();
  return useQuery({
    queryKey: queryKeys.jobs.all(projectId),
    queryFn: async (): Promise<AnyJobRecord[]> => {
      const response = await fetchWithAuth(
        `${baseUrl}/jobs/${projectId && projectId != "all" ? `?project_id=${projectId}` : ""}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job types");
      }
      return response.json();
    },
  });
};

export default useJobs;
