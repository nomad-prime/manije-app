import { useExecuteAction } from "@/hooks/useExecuteAction";
import { Action } from "@/hooks/useJobs";
import { CustomButton } from "@/components/ui/custom-button";

export default function PostJobActions({
  actions,
  output,
}: {
  actions: Action[];
  output: Record<string, unknown>;
}) {
  const { mutateAsync: executeAction } = useExecuteAction();

  const handleAction = async (action: Action) => {
    try {
      await executeAction({
        action: action.name,
        data: {
          output: output,
          args: JSON.parse(action.args),
        },
      });
    } catch (error) {
      console.error("Error executing action:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {actions.map((action) => (
        <CustomButton
          key={action.name}
          size="sm"
          variant="secondary"
          onClick={() => handleAction(action)}
        >
          {action.label}
        </CustomButton>
      ))}
    </div>
  );
}
