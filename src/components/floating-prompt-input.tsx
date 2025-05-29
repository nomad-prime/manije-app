"use client";

import { motion, AnimatePresence } from "framer-motion";
import PromptInput from "./prompt-input";
import { useState } from "react";
import { Manije } from "@/components/manije";

const FloatingPromptInput = ({
  onSubmit,
  disabled,
}: {
  onSubmit: (prompt: string) => void;
  disabled: boolean;
}) => {
  const [fullScreen, setFullScreen] = useState(false);

  const handleToggle = () => {
    setFullScreen((prev) => !prev);
  };

  const handleSubmit = (prompt: string) => {
    onSubmit(prompt);
    setFullScreen(false);
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {fullScreen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
            onClick={handleToggle}
          />
        )}
      </AnimatePresence>

      {/* Input that grows from bottom-right but appears centered */}
      <AnimatePresence>
        {fullScreen && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
            style={{ transformOrigin: "bottom right" }}
          >
            <div className="w-full max-w-2xl pointer-events-auto">
              <PromptInput onSubmit={handleSubmit} disabled={disabled} focus />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!fullScreen && (
        <motion.button
          key="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={handleToggle}
          className="fixed bottom-4 right-4 z-30 w-12 h-12 rounded-full flex bg-muted items-center justify-center shadow-lg"
        >
          <Manije className="w-8 h-8" />
        </motion.button>
      )}
    </>
  );
};

export default FloatingPromptInput;
