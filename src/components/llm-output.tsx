import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { motion } from "framer-motion";
import "highlight.js/styles/atom-one-dark.css";

import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";

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

const components: Components = {
  code: Code as Components["code"],
  p: ({ children }) => (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
    >
      {children}
    </motion.p>
  ),
};

export function LlmOutputComponent({
  content,
  className,
  rehype,
}: {
  content: string;
  className: string;
  rehype?: boolean;
}) {
  return (
    <div className={cn("w-full bg-background rounded-md px-3 py-2", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehype ? [rehypeRaw] : [rehypeRaw, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export const LlmOutput = memo(
  LlmOutputComponent,
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.className === nextProps.className,
);

export default LlmOutput;
