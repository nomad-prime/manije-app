"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useRef, useState, useEffect } from "react";
import useSession from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Send, ArrowDown, ArrowRight } from "lucide-react";
import LoadingDots from "@/components/loading-dots";
import LlmOutput from "@/components/llm-output";
import { motion, AnimatePresence } from "framer-motion";

const SessionCard = ({ sessionId }: { sessionId: string | null }) => {
  const { data: session, isLoading } = useSession(sessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/sessions/${sessionId}`,
    }),
  });

  const isSending = status === "streaming" || status === "submitted";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkIfAtBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const isBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

    setIsAtBottom(isBottom);
    return isBottom;
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      checkIfAtBottom();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      setShowScrollButton(false);
    } else if (isSending || messages.length > 0) {
      setShowScrollButton(true);
    }
  }, [messages, isSending, isAtBottom]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    sendMessage({ text: input });
    setInput("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-[840px] mx-auto w-full relative">
      {session?.title && (
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">{session.title}</h2>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 pb-40 space-y-4 relative"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start a conversation with the agent
          </div>
        ) : (
          messages.map((message) => {
            const textContent = message.parts
              .filter((part) => part.type === "text")
              .map((part) => ("text" in part ? part.text : ""))
              .join("");

            return (
              <div
                key={message.id}
                className={`flex justify-start`}
              >
                {message.role === "assistant" ? (
                  <LlmOutput content={textContent} className="max-w-[80%]" />
                ) : (
                  <div className="max-w-[80%] rounded-lg bg-primary text-primary-foreground px-4 py-2">
                    <p className="whitespace-pre-wrap">{textContent}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />

        <AnimatePresence>
          {showScrollButton && !isAtBottom && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-4 right-4 z-10"
            >
              <motion.button
                onClick={scrollToBottom}
                className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowDown className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pt-4 max-w-[840px] mx-auto">
        <form onSubmit={handleSubmit} className={"bg-background"}>
          <div className="relative">
            <textarea
              id={"input"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-popover"
              rows={3}
              disabled={status !== "ready"}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isSending}
              size="icon"
              className="absolute bottom-4 right-3 h-8 w-8"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground bg-background b-2 ml-1">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
};

export default SessionCard;
