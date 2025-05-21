"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

const PromptInput = ({ onSubmit, disabled }: { onSubmit: (prompt: string) => void, disabled: boolean }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(value);
        setValue("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          onSubmit(value);
          setValue("");
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        }
      }}
      className="relative w-full min-w-[600px] max-w-[800px] bg-muted"
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Let's start..."
        disabled={disabled}
        className="w-full resize-none max-h-[300px] overflow-auto px-4 py-3 pr-16"
      />
      <Button
        type="submit"
        size="sm"
        className="absolute bottom-2 right-2 rounded-full h-8 w-8"
        disabled={disabled || value.trim() === ""}
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
    </form>
  );
};

export default PromptInput;
