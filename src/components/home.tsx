import { useRouter } from "next/navigation";
import useCreateJobStream from "@/hooks/use-create-job-stream";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import PromptInput from "@/components/prompt-input";

export const Home = () => {
  const router = useRouter();

  const { mutateAsync, isPending } = useCreateJobStream();

  const createJob = async (prompt: string) => {
    try {
      const response = await mutateAsync({ data: { input: prompt } });
      console.log("Job created successfully:", response);
      router.push(`/projects/all/jobs/${response.id}`);
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        <div className="flex flex-row items-center justify-center gap-8 h-full">
          <motion.div layoutId="prompt">
            <PromptInput onSubmit={createJob} disabled={isPending} />
          </motion.div>
        </div>
      </AnimatePresence>
    </LayoutGroup>
  );
};
