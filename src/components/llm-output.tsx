import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";

import "highlight.js/styles/atom-one-dark.css";

import { ReactNode } from "react";
import {cn} from "@/lib/utils";

type CodeProps = {
  node: { type: string };
  inline?: boolean;
  className?: string;
  children: ReactNode;
};

const Code = ({ node, className, children, ...props }: CodeProps) => {
  const isInline = node?.type !== "code";
  return isInline ? (
    <code {...props}>{children}</code>
  ) : (
    <pre>
      <code className={className} {...props}>
        {children}
      </code>
    </pre>
  );
};

export function LlmOutput({
  content,
  className,
}: {
  content: string;
  className: string;
}) {
  return (
    <div className={cn("text-sm w-full bg-background rounded-md border-input border-1 px-3 py-2", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          code: Code as Components["code"],
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default LlmOutput;
