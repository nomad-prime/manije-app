import { AssetReviewCard } from "@/components/asset-review-card";
import type { CreateProjectAssetInput } from "@/types/tools";

type ToolPartState = "input-streaming" | "input-available" | "output-available" | "output-error";

interface CreateProjectAssetToolPartProps {
  state: ToolPartState;
  toolCallId: string;
  input?: CreateProjectAssetInput;
  output?: string;
  errorText?: string;
  onAddToolOutput: <TOOL extends "create_project_asset">(params:
    | {
        state?: "output-available";
        tool: TOOL;
        toolCallId: string;
        output: {
          content: string;
        };
        errorText?: undefined;
      }
    | {
        state: "output-error";
        tool: TOOL;
        toolCallId: string;
        output?: undefined;
        errorText: string;
      }
  ) => Promise<void>;
}

export const CreateProjectAssetToolPart = ({
  state,
  toolCallId,
  input,
  output,
  errorText,
  onAddToolOutput,
}: CreateProjectAssetToolPartProps) => {
  switch (state) {
    case "input-streaming":
      return (
        <div className="text-sm text-muted-foreground">Creating asset...</div>
      );

    case "input-available":
      if (!input) return null;
      return (
        <AssetReviewCard
          asset={{
            title: input.title,
            description: input.description,
            type: input.type,
            data: input.data,
          }}
          onApprove={() => {
            onAddToolOutput({
              tool: "create_project_asset",
              toolCallId,
              output: {
                content: `I approve the ${input.type} "${input.title}". Looks good!`,
              },
            });
          }}
          onReject={(reason) => {
            onAddToolOutput({
              tool: "create_project_asset",
              toolCallId,
              output: {
                content: `I reject the ${input.type} "${input.title}". Reason: ${reason}`
              },
            });
          }}
        />
      );

    case "output-available":
      return (
        <div className="text-sm text-green-600 dark:text-green-400 max-w-[80%] p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
          {output}
        </div>
      );

    case "output-error":
      return (
        <div className="text-sm text-red-600 dark:text-red-400 max-w-[80%] p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
          Error: {errorText}
        </div>
      );
  }
};
