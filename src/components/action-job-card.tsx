"use client";

import { CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PostJobActions from "@/components/post-job-actions";
import { ActionOutcome, useExecuteAction } from "@/hooks/use-execute-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Action, ActionJobRecord } from "@/hooks/use-jobs";

interface ActionJobCardProps {
  job: ActionJobRecord;
}

const ActionJobCard = ({ job }: ActionJobCardProps) => {
  const output = job.output ?? {};
  const { push } = useRouter();

  const { mutate: executeAction } = useExecuteAction({
    onSuccess: (outcome: ActionOutcome) => {
      toast.success(outcome.message);
      if (outcome.redirect_to) push(outcome.redirect_to);
    },
  });

  const handleActionClick = (action: Action) => {
    if (!job.id) return;
    executeAction({
      id: action.id,
      job_record_id: job.id,
    });
  };

  return (
    <div className='p-1'>
      <div className="flex flex-col gap-4 px-4">
        {Object.entries(output).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2">
            <Label
              htmlFor={`output-${key}`}
              className="mt-2 text-muted-foreground"
            >
              {key}
            </Label>
            <p className="bg-background border px-3 py-3 rounded-lg text-justify text-sm">
              {typeof value === "string" ? value : JSON.stringify(value)}
            </p>
          </div>
        ))}
      </div>
      <CardFooter className="flex flex-col items-end gap-4 px-6 pb-4 mt-4">
        <PostJobActions
          actions={job.actions || []}
          onActionClick={handleActionClick}
        />
      </CardFooter>
    </div>
  );
};

export default ActionJobCard;
