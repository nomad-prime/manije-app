import { useRouter } from "next/navigation";
import useCreateJobStream from "@/hooks/use-create-job-stream";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import PromptInput from "@/components/prompt-input";
import ProjectsCarousel from "@/components/projects-carousel";

export const Home = () => {
  const router = useRouter();

  const { mutateAsync, isPending } = useCreateJobStream();

  const createJob = async (prompt: string) => {
    try {
      const response = await mutateAsync({ data: { input: prompt } });
      router.push(`/projects/all/jobs/${response.id}`);
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <ProjectsCarousel />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <div className="flex flex-row items-center justify-center gap-8 h-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            layoutId="prompt"
          >
            <PromptInput
              onSubmit={createJob}
              disabled={isPending}
              className="w-[640px] max-w-[640px]"
            />
          </motion.div>
        </div>
      </AnimatePresence>
    </LayoutGroup>
  );
};
