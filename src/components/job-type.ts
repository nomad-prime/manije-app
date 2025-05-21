export type JobType = {
  id?: string;
  name: string;
  system_prompt: string;
  user_prompt: string;
  model: string;
  description: string;
  output_schema: unknown;
  created_at?: string;
  updated_at?: string;
  structured_output?: boolean;
};
