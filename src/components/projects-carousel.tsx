import useProjects from "@/hooks/use-projects";
import { ProjectCard, ProjectCardSkeleton } from "@/components/project-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

const ProjectsCarousel = () => {
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="w-full"
    >
      <h2 className="text-2xl font-bold mb-4">Recent projects</h2>
      <Carousel
        className="w-full max-w-xs md:max-w-2xl lg:max-w-6xl mx-auto"
        opts={{
          loop: false,
          align: "start",
        }}
      >
        <CarouselContent className="-ml-4">
          {isLoadingProjects &&
            Array.from({length: 5}).map((_, idx) => (
              <CarouselItem
                className="pl-0 md:basis-1/2 lg:basis-1/3"
                key={idx}
              >
                <ProjectCardSkeleton/>
              </CarouselItem>
            ))}
          {projects?.map((project) => (
            <CarouselItem
              className="md:basis-1/2 lg:basis-1/3"
              key={project.id}
            >
              <ProjectCard project={project}/>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="block md:hidden">
          {projects && projects.length > 1 && (
            <>
              <CarouselPrevious/>
              <CarouselNext/>
            </>
          )}
        </div>
        <div className="hidden md:block">
          {projects && projects.length > 2 && (
            <>
              <CarouselPrevious/>
              <CarouselNext/>
            </>
          )}
        </div>
      </Carousel>
    </motion.div>
  );
};

export default ProjectsCarousel;
