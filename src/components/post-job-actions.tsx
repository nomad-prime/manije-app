"use client";

import { Action } from "@/hooks/use-jobs";
import { CustomButton } from "@/components/ui/custom-button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const PostJobActions = ({
  actions,
  executingActions,
  onActionClick,
}: {
  actions: Action[];
  onActionClick: (action: Action) => void;
  executingActions: string[];
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <AnimatePresence>
        {actions.map((action) => {
          const isExecuting = executingActions.includes(action.name);
          const show = !action.executed || isExecuting;

          return (
            show && (
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
                  disabled={isExecuting || action.executed}
                  loading={isExecuting}
                  nudge
                  className={cn(
                    "relative overflow-hidden",
                    (isExecuting || action.executed) && "pointer-events-none",
                  )}
                >
                  <span className="z-10 relative flex items-center gap-1">
                    {action.executed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      action.label
                    )}
                  </span>
                </CustomButton>
              </motion.div>
            )
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default PostJobActions;
