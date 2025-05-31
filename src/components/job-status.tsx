import {CheckCircle, Pencil} from "lucide-react";
import { ReactNode } from "react";
import { JobStatusType } from "@/hooks/use-jobs";

const JobStatusIconMap: Record<
  JobStatusType,
  { label: string; icon: ReactNode; color: string }
> = {
  draft: {
    label: "draft",
    icon: <Pencil className="h-4 w-4 text-yellow-500" />,
    color: "text-yellow-500",
  },
  done: {
    label: "Completed",
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    color: "text-green-500",
  },
};

const JobStatus = ({ status }: { status: JobStatusType; label?: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      {JobStatusIconMap[status]?.icon}
    </div>
  );
};

export { JobStatusIconMap, JobStatus };
