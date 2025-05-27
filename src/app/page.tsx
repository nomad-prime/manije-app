import PromptPage from "@/components/prompt-page";

export default function Home() {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-background text-foreground font-sans px-4">
      <PromptPage />
    </div>
  );
}
