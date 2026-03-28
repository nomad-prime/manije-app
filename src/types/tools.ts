import type { UIMessage } from "ai";

export interface CreateProjectAssetInput {
  title: string;
  description: string;
  type: string;
  content?: string;
}

export interface CreateProjectAssetOutput {
  content: string;
}

export interface ShowAssetOutput {
  asset_id: string;
  title: string;
  description: string;
  content: string;
  status: string;
  type: string;
}

export interface ShowTaskOutput {
  task_id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  asset_id?: string;
}

export interface HideContextOutput {
  action: string;
}

export type ProjectTools = {
  create_project_asset: {
    input: CreateProjectAssetInput;
    output: CreateProjectAssetOutput;
  };
  show_asset: {
    input: { asset_id: string };
    output: ShowAssetOutput;
  };
  show_task: {
    input: { task_id: string };
    output: ShowTaskOutput;
  };
  hide_context: {
    input: Record<string, never>;
    output: HideContextOutput;
  };
};

export type ProjectUIMessage = UIMessage<unknown, never, ProjectTools>;
