import { useRouter } from "next/navigation";
import useCreateProject from "@/hooks/use-create-project";
import useCreateSession from "@/hooks/use-create-session";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import ProjectsCarousel from "@/components/projects-carousel";
import PromptInput from "@/components/prompt-input";
import { useState } from "react";

export const Home = () => {
  const router = useRouter();
  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: createSession } = useCreateSession();
  const [isCreating, setCreating] = useState(false);

  const handleCreateProject = async (prompt: string) => {
    try {
      setCreating(true);
      const project = await createProject(prompt);
      const session = await createSession({ projectId: project.id });
      router.push(`/projects/${project.id}/sessions/${session.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      setCreating(false);
    }
  };

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <div className="flex flex-col items-center justify-center gap-8 h-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl font-bold">Welcome to Manije</h1>
            <PromptInput
              onSubmit={handleCreateProject}
              disabled={isCreating}
              placeholder="Describe your project..."
            />
          </motion.div>
        </div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <ProjectsCarousel />
      </AnimatePresence>
    </LayoutGroup>
  );
};
