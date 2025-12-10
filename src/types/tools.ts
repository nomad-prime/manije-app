import type { UIMessage } from "ai";

export interface CreateProjectAssetInput {
  title: string;
  description: string;
  type: string;
  data?: Record<string, unknown>;
}

export interface CreateProjectAssetOutput {
  content: string;
}

export type ProjectTools = {
  create_project_asset: {
    input: CreateProjectAssetInput;
    output: CreateProjectAssetOutput;
  };
};

export type ProjectUIMessage = UIMessage<unknown, never, ProjectTools>;
