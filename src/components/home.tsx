import { useRouter } from "next/navigation";
import useCreateProject from "@/hooks/use-create-project";
import useCreateSession from "@/hooks/use-create-session";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ManijeButton } from "@/components/ui/manije-button";
import ProjectsCarousel from "@/components/projects-carousel";
import { useState } from "react";

export const Home = () => {
  const router = useRouter();
  const { mutateAsync: createProject } = useCreateProject();
  const { mutateAsync: createSession } = useCreateSession();
  const [isCreating, setCreating] = useState(false);

  const handleCreateProject = async () => {
    try {
      setCreating(true)
      const project = await createProject();
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
            <ManijeButton
              onClick={handleCreateProject}
              disabled={isCreating}
              size="lg"
              className="px-8 py-6 text-lg"
            >
              {isCreating ? "Creating..." : "Start by creating a new project"}
            </ManijeButton>
          </motion.div>
        </div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <ProjectsCarousel />
      </AnimatePresence>
    </LayoutGroup>
  );
};
