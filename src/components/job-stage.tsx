import {
  Pencil,
  PlayCircle,
  Loader2,
  CheckCircle2,
  Rocket,
  XCircle,
  HelpCircle, Target,
} from "lucide-react";
import { ReactNode } from "react";
import { JobStageType } from "@/hooks/use-jobs";

const JobStageIconMap: Record<
  JobStageType,
  { label: string; icon: ReactNode; color: string }
> = {
  completed: {
    label: "Validating Input",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    color: "text-green-500",
  },
  ready_for_actions: {
    label: "Ready For Actions",
    icon: <Target className="h-4 w-4 text-blue-500" />,
    color: "text-blue-500",
  },
  validating_input: {
    label: "Validating Input",
    icon: <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />,
    color: "text-yellow-500",
  },
  pending_classification: {
    label: "Classifying",
    icon: <Loader2 className="h-4 w-4 animate-spin text-purple-500" />,
    color: "text-muted-foreground",
  },
  classifying: {
    label: "Classifying",
    icon: <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />,
    color: "text-yellow-500",
  },
  awaiting_user_feedback: {
    label: "Awaiting Feedback",
    icon: <Pencil className="h-4 w-4 text-yellow-500" />,
    color: "text-yellow-500",
  },
  ready_for_execution: {
    label: "Ready for Execution",
    icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
    color: "text-blue-500",
  },
  processing: {
    label: "Processing",
    icon: <Loader2 className="h-4 w-4 animate-spin text-purple-500" />,
    color: "text-purple-500",
  },
  post_processing: {
    label: "Processing",
    icon: <Loader2 className="h-4 w-4 animate-spin text-purple-500" />,
    color: "text-purple-500",
  },
  ready_for_review: {
    label: "Ready For Review",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    color: "text-green-500",
  },
  conversing: {
    label: "Conversing",
    icon: <Pencil className="h-4 w-4 text-yellow-500" />,
    color: "text-yellow-500",
  },
  started: {
    label: "Started",
    icon: <Rocket className="h-4 w-4 text-cyan-500" />,
    color: "text-cyan-500",
  },
  failed: {
    label: "Failed",
    icon: <XCircle className="h-4 w-4 text-red-500" />,
    color: "text-red-500",
  },
};

const JobStage = ({
  stage,
  label,
}: {
  stage: JobStageType;
  label?: boolean;
}) => {
  return (
    <div className="flex items-center gap-2">
      {JobStageIconMap[stage]?.icon}
      {label && (
        <span className={`text-sm ${JobStageIconMap[stage]?.color}`}>
          {JobStageIconMap[stage]?.label || stage}
        </span>
      )}
    </div>
  );
};

export { JobStageIconMap, JobStage };
