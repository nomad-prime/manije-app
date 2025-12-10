import LlmOutput from "@/components/llm-output";

interface TextMessagePartProps {
  text: string;
  role: "user" | "assistant" | "system";
}

export const TextMessagePart = ({ text, role }: TextMessagePartProps) => {
  if (!text) return null;

  if (role === "assistant") {
    return <LlmOutput content={text} className="max-w-[80%]" />;
  }

  if (role === "user") {
    return (
      <div className="max-w-[80%] rounded-lg bg-primary text-primary-foreground px-4 py-2">
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    );
  }

  return null;
};