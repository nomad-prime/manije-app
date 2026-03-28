"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { FormEvent, useRef, useState, forwardRef, useImperativeHandle } from "react";
import useSession from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LoadingDots from "@/components/loading-dots";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/cache-keys";
import {
  TextMessagePart,
  CreateProjectAssetToolPart,
  ShowAssetToolPart,
  ShowTaskToolPart,
  HideContextToolPart,
} from "@/components/message-parts";
import type { ProjectUIMessage } from "@/types/tools";

export interface SessionCardHandle {
  sendSystemMessage: (text: string) => Promise<void>;
}

interface SessionCardProps {
  sessionId: string | null;
  initialMessages?: ProjectUIMessage[];
}

const SessionCard = forwardRef<SessionCardHandle, SessionCardProps>(({ sessionId, initialMessages }, ref) => {
  const { data: session, isLoading: isSessionLoading } = useSession(sessionId);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, addToolOutput } = useChat<ProjectUIMessage>({
    transport: new DefaultChatTransport({
      api: `/api/sessions/${sessionId}`,
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    messages: initialMessages,
    onError: (err) => {
      console.error(err);
    },
  });

  useImperativeHandle(ref, () => ({
    sendSystemMessage: async (text: string) => {
      await sendMessage({
        role: "system",
        parts: [{ type: "text", text }],
      });
    },
  }), [sendMessage]);

  const isSending = status === "streaming" || status === "submitted";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    await sendMessage({ text: input });

    queryClient.invalidateQueries({
      queryKey: queryKeys.sessions.all(),
    });

    setInput("");
  };

  if (isSessionLoading) {
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
          messages.map((message) => (
            <div key={message.id} className="space-y-2">
              {(message.parts ?? []).map((part, index) => {
                if (part.type === "text") {
                  const textContent = "text" in part ? part.text : "";
                  return (
                    <div key={index}>
                      <TextMessagePart text={textContent} role={message.role} />
                    </div>
                  );
                }
                if (part.type === "tool-create_project_asset") {
                  return (
                    <CreateProjectAssetToolPart
                      key={part.toolCallId}
                      state={part.state}
                      toolCallId={part.toolCallId}
                      input={part.state === "input-available" ? part.input : undefined}
                      errorText={part.state === "output-error" ? part.errorText : undefined}
                      onAddToolOutput={addToolOutput}
                    />
                  );
                }

                if (part.type === "tool-show_asset") {
                  return (
                    <ShowAssetToolPart
                      key={part.toolCallId}
                      state={part.state}
                      output={part.state === "output-available" ? part.output : undefined}
                      errorText={part.state === "output-error" ? part.errorText : undefined}
                    />
                  );
                }
                if (part.type === "tool-show_task") {
                  return (
                    <ShowTaskToolPart
                      key={part.toolCallId}
                      state={part.state}
                      output={part.state === "output-available" ? part.output : undefined}
                      errorText={part.state === "output-error" ? part.errorText : undefined}
                    />
                  );
                }
                if (part.type === "tool-hide_context") {
                  return (
                    <HideContextToolPart
                      key={part.toolCallId}
                      state={part.state}
                    />
                  );
                }

                // Handle dynamic tools (if backend sends tools we don't know about)
                if (part.type === "dynamic-tool") {
                  const callId = part.toolCallId;

                  switch (part.state) {
                    case "input-streaming":
                      return (
                        <div key={callId} className="text-sm text-muted-foreground">
                          Tool {part.toolName} is being called...
                        </div>
                      );

                    case "input-available":
                      return (
                        <div
                          key={callId}
                          className="text-sm p-3 rounded-lg bg-muted max-w-[80%]"
                        >
                          <div className="font-medium mb-1">Tool: {part.toolName}</div>
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(part.input, null, 2)}
                          </pre>
                        </div>
                      );

                    case "output-available":
                      return (
                        <div
                          key={callId}
                          className="text-sm p-3 rounded-lg bg-muted max-w-[80%]"
                        >
                          <div className="font-medium mb-1">
                            Tool {part.toolName} result:
                          </div>
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(part.output, null, 2)}
                          </pre>
                        </div>
                      );

                    case "output-error":
                      return (
                        <div
                          key={callId}
                          className="text-sm text-red-600 dark:text-red-400 max-w-[80%] p-3 rounded-lg bg-red-50 dark:bg-red-950/20"
                        >
                          Tool {part.toolName} error: {part.errorText}
                        </div>
                      );
                  }
                }

                return null;
              })}
            </div>
          ))
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
        <form onSubmit={handleSubmit} className="glass rounded-xl pb-4 pt-2 px-2">
          <div className="relative">
            <textarea
              id={"input"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--glow)]/40 bg-surface-container-highest"
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
});

SessionCard.displayName = "SessionCard";

export default SessionCard;
