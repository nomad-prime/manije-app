import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@/hooks/use-projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({
  project
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="bg-muted hover:bg-muted/80 transition border rounded-xl p-4 w-64 flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 mb-4">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
        </div>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Open jobs</span>
          <Badge>{project.open_jobs}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Done jobs</span>
          <Badge variant="secondary">{project.done_jobs}</Badge>
        </div>
      </div>
    </Link>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-muted border rounded-xl p-4 w-64 flex flex-col justify-between animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-6 rounded-md" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-6 rounded-md" />
        </div>
        <Skeleton className="h-2 w-1/3 mt-2" />
      </div>
    </div>
  );
}
