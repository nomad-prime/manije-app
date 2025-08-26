import { useRouter } from "next/navigation";
import useCreateProject from "@/hooks/use-create-project";
import { motion } from "framer-motion";
import { ManijeButton } from "@/components/ui/manije-button";

export const Home = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProject();

  const handleCreateProject = async () => {
    try {
      const project = await mutateAsync();
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-6"
      >
        <h1 className="text-4xl font-bold">Welcome to Manije</h1>
        <p className="text-lg text-muted-foreground">Start by creating a new project</p>
        <ManijeButton
          onClick={handleCreateProject}
          disabled={isPending}
          size="lg"
          className="px-8 py-6 text-lg"
        >
          {isPending ? "Creating..." : "Create New Project"}
        </ManijeButton>
      </motion.div>
    </div>
  );
};
