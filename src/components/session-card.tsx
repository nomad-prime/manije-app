"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FormEvent, useEffect, useRef, useState } from "react";
import useSession from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LoadingDots from "@/components/loading-dots";
import LlmOutput from "@/components/llm-output";

const SessionCard = ({ sessionId }: { sessionId: string | null }) => {
  const { data: session, isLoading } = useSession(sessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/sessions/${sessionId}`,
    }),
    onError: (err) => {
      console.error(err);
    },
  });
  const session_messages = session?.messages;

  useEffect(() => {
    if (session_messages?.length) {
      const init_messages = session_messages.map((msg) => {
        const parts = msg.parts
          ? msg.parts.map((part) => ({
              type: part.type as "text",
              text: part.text,
            }))
          : [{ type: "text" as const, text: msg.content || "" }];

        return {
          id: msg.id,
          role: msg.role,
          parts,
        };
      });
      setMessages(init_messages);
    }
  }, [session_messages, setMessages]);

  const isSending = status === "streaming" || status === "submitted";

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
    <div className="flex-1 flex flex-col w-full relative max-w-[840px]">
      {session?.title && (
        <h2 className="text-lg p-4 font-semibold">{session.title}</h2>
      )}

      <div className="flex-1 p-4 pb-12 space-y-4 relative">
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
              <div key={message.id} className={`flex justify-start`}>
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
      </div>

      <div className="sticky bottom-0 left-0 right-0 px-4">
        <form onSubmit={handleSubmit} className={"bg-background pb-4"}>
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
