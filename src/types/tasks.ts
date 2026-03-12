export type TaskStatus = "unclaimed" | "claimed" | "in_progress" | "completed" | "failed";

export type TaskType = "genesis" | "follow_up";

export interface AgentTask {
  id: string;
  project_id: string;
  tenant_id: string;
  type: TaskType;
  description: string;
  created_by_agent?: string;
  status: TaskStatus;
  claimed_by?: string;
  claimed_at?: string;
  last_heartbeat_at?: string;
  session_id?: string;
  draft_asset_id?: string;
  error_message?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  tasks: AgentTask[];
}
