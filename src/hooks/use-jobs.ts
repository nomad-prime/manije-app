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

export type JobStageType =
  | "started"
  | "evaluating_input"
  | "valid_input"
  | "wait_for_user"
  | "collecting_data"
  | "data_collected"
  | "summarizing"
  | "summarized"
  | "classifying"
  | "classified"
  | "processing"
  | "processed"
  | "ready_for_review"
  | "ready_for_actions"
  | "failed"
  | "completed"


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

type ConversationStages = "evaluating_input" | "wait_for_user"

export interface ConversationJobRecord extends JobRecord {
  messages: ChatMessage[];
  stage: ConversationStages;
}

type ReviewStages = "ready_for_review"

export interface ReviewJobRecord extends JobRecord {
  output: Record<string, unknown>;
  stage: ReviewStages;
}

type ActionStages = "ready_for_actions"

export interface ActionJobRecord extends JobRecord {
  output: Record<string, unknown>;
  actions: Action[];
  stage: ActionStages;
}

interface GenericJobRecord extends JobRecord {
  stage: Exclude<
    JobStageType,
    ConversationStages | ActionStages | ReviewStages
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
