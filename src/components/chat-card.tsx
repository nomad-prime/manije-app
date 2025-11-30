"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import useSession from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatCard = ({ sessionId }: { sessionId: string | null }) => {
  const { data: session, isLoading } = useSession(sessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isSending = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="h-full flex flex-col max-w-[840px] mx-auto w-full">
      {session?.title && (
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">{session.title}</h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                    >
                      {textContent}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{textContent}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatCard;
