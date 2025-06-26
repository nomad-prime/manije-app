"use client";

import {useEffect, useState} from "react";
import { toast } from "sonner";
import { ConversationJobRecord } from "@/hooks/use-jobs";
import useJobConversation from "@/hooks/use-job-conversation";
import PromptInput from "@/components/prompt-input";
import LlmOutput from "@/components/llm-output";
import { motion } from "framer-motion";

interface ConversationJobCardProps {
  job: ConversationJobRecord;
}

const ConversationJobCard = ({ job }: ConversationJobCardProps) => {
  const [messages, setMessages] = useState(job.messages ?? []);

  const [submitting, setSubmitting] = useState(false);

  const { mutate: submitFeedback } = useJobConversation({
    onDone: () => {
      setSubmitting(false);
    }
  });

  const handleSubmit = (prompt: string) => {
    setSubmitting(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt, id: Date.now().toString() },
    ]);
    submitFeedback(
      { job_id: job.id, input: prompt },
      {
        onSuccess: () => {
          setSubmitting(false);
        },
        onError: () => toast.error("Error submitting feedback"),
      },
    );
  };

  useEffect(() => {
    setMessages(job.messages ?? []);
  }, [job.id, job.messages]);

  return (
    <div className="w-full">
      <div className="flex flex-col pb-14">
        <div className="flex flex-col gap-4 overflow-y-hidden pb-8 flex-grow">
          {messages.length > 0 &&
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.role === "user" ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: message.role === "user" ? -10 : 10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <LlmOutput
                  content={message.content}
                  className={
                    message.role === "user"
                      ? "bg-secondary text-secondary-foreground max-w-96 place-self-end border-input border-1 "
                      : ""
                  }
                />
              </motion.div>
            ))}
        </div>
      </div>
      <motion.div className="sticky bottom-0 pb-10 bg-background w-full">
        <PromptInput
          onSubmit={handleSubmit}
          disabled={submitting}
          className="max-w-[840px] w-full"
          placeholder={"Answer here..."}
        />
      </motion.div>
    </div>
  );
};

export default ConversationJobCard;
