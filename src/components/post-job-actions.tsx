"use client";

import { Action } from "@/hooks/use-jobs";
import { CustomButton } from "@/components/ui/custom-button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const PostJobActions = ({
  actions,
  onActionClick,
}: {
  actions: Action[];
  onActionClick: (action: Action) => void;
}) => {
  const nonExecutedActions = actions.filter((action) => !action.executed);

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <AnimatePresence>
        {nonExecutedActions.map((action) => (
          <motion.div
            key={action.name}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <CustomButton
              size="sm"
              variant="secondary"
              onClick={() => onActionClick(action)}
              disabled={action.executed}
              nudge
              className={cn(
                "relative overflow-hidden",
                action.executed && "pointer-events-none",
              )}
            >
              <span className="z-10 relative flex items-center gap-1">
                {action.executed ? <Check className="w-4 h-4" /> : action.label}
              </span>
            </CustomButton>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PostJobActions;
