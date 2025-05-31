import { JobRecord } from "@/hooks/use-jobs";
import { CustomButton } from "@/components/ui/custom-button";
import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const rotatingMessages = [
  "Feel free to make changes. Otherwise ⬇️",
  "Is everything looking good? ⬇️",
  "Happy with the result? ⬇️",
  "Need a tweak? Or done for now? ⬇️",
  "Want to fine-tune before continuing? ⬇️",
  "Almost there? Click below when ready 👇",
  "No rush. Take your time reviewing ⏳",
  "Looks solid? Tap to move forward ✅",
  "Want to edit something first? If not, hit done 👇",
  "Does this feel right? If so, you know what to do 👇",
];

const JobStatusSelect = ({ job }: { job: JobRecord }) => {
  const jobStage = job.stage;
  const jobStatus = job.status;

  const isCompleted = jobStage === "completed" && jobStatus === "draft";

  const selectedMessage = useMemo(() => {
    const index = Math.floor(Math.random() * rotatingMessages.length);
    return rotatingMessages[index];
  }, []);

  return (
    <div className="flex flex-col items-end gap-2 pr-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={selectedMessage}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          {selectedMessage}
        </motion.p>
      </AnimatePresence>
      {isCompleted && (
        <CustomButton
          size="sm"
          variant="default"
          onClick={() => alert("Job is completed!")}
        >
          Done
        </CustomButton>
      )}
    </div>
  );
};

export default JobStatusSelect;
