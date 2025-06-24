"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { CustomTextarea } from "@/components/ui/custom-textarea";
import { cn } from "@/lib/utils";

const PromptInput = ({
  onSubmit,
  disabled,
  placeholder = "Let's start...",
  focus = true,
  className = "",
}: {
  onSubmit: (prompt: string) => void;
  disabled: boolean;
  placeholder?: string;
  focus?: boolean;
  className?: string;
}) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (focus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focus]);

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
      className={cn("relative w-full min-w-[480px]", className)}
    >
      <CustomTextarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
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
