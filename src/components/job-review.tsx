import { ReviewJobRecord } from "@/hooks/use-jobs";
import { ManijeButton } from "@/components/ui/manije-button";
import { useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import useAcceptJob from "@/hooks/use-accept-job";

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

const JobReview = ({ job }: { job: ReviewJobRecord }) => {
  const jobStage = job.stage;

  const isReady = jobStage === "ready_for_review";

  const selectedMessage = useMemo(() => {
    const index = Math.floor(Math.random() * rotatingMessages.length);
    return rotatingMessages[index];
  }, []);

  const { mutateAsync } = useAcceptJob({ jobId: job.id });

  const handleDoneClick = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      console.error("Error marking job as done:", error);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 ">
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
      {isReady && (
        <ManijeButton size="sm" variant="default" onClick={handleDoneClick}>
          Done
        </ManijeButton>
      )}
    </div>
  );
};

export default JobReview;
