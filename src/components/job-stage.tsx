import {
  Pencil,
  Loader2,
  CheckCircle2,
  Rocket,
  XCircle,
  Database,
  Upload,
  PartyPopper,
} from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { JobStageType } from "@/hooks/use-jobs";

const JobStageIconMap: Record<
  JobStageType,
  { label: string; icon: ReactNode; color: string }
> = {
  classified: { label: "classified", color: "", icon: undefined },
  data_collected: { label: "data collected", color: "", icon: undefined },
  processed: { label: "processed", color: "", icon: undefined },
  summarized: { label: "summarized", color: "", icon: undefined },
  summarizing: { label: "summarizing", color: "", icon: undefined },
  valid_input: {
    label: "looks solid",
    color: "text-green-500",
    icon: <PartyPopper className="h-4 w-4 text-green-500" />,
  },
  collecting_data: {
    label: "collecting data",
    color: "text-purple-500",
    icon: <Database className="h-4 w-4 text-purple-500" />,
  },
  completed: {
    label: "completed",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    color: "text-green-500",
  },
  ready_for_actions: {
    label: "Ready For Actions",
    icon: <Upload className="h-4 w-4 text-blue-500" />,
    color: "text-blue-500",
  },
  evaluating_input: {
    label: "Evaluating",
    icon: <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />,
    color: "text-yellow-500",
  },
  classifying: {
    label: "Classifying",
    icon: <Loader2 className="h-4 w-4 animate-spin text-purple-500" />,
    color: "text-yellow-500",
  },
  wait_for_user: {
    label: "Awaiting Feedback",
    icon: <Pencil className="h-4 w-4 text-yellow-500" />,
    color: "text-yellow-500",
  },
  processing: {
    label: "Processing",
    icon: <Loader2 className="h-4 w-4 animate-spin text-purple-500" />,
    color: "text-purple-500",
  },
  ready_for_review: {
    label: "Ready For Review",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    color: "text-green-500",
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
    <motion.div className="flex items-center gap-2">
      {JobStageIconMap[stage]?.icon}
      {label && (
        <span className={`text-sm ${JobStageIconMap[stage]?.color}`}>
          {JobStageIconMap[stage]?.label || stage}
        </span>
      )}
    </motion.div>
  );
};

export { JobStageIconMap, JobStage };
