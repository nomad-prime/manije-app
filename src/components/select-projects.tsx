"use client";

import React, { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useProjects from "@/hooks/use-projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/hooks/use-project";

function SelectProject({ id }: { id: string }) {
  const { data: project } = useProject(id);
  if (!project) return null;

  return (
    <SelectItem value={id}>
      {(project.data?.["name"] as string) || "Unnamed Project"}
    </SelectItem>
  );
}

export const SelectProjects = () => {
  const { data: projects } = useProjects();

  const router = useRouter();
  const params = useParams();

  // Get project ID from URL params
  const currentProjectId = (params.slugs?.[0] as string) || null;

  const handleSelect = (value: string) => {
    if (value === currentProjectId) return;
    if (value === "all") {
      router.push("/projects");
    } else {
      router.push(`/projects/${value}`);
    }
  };

  return (
    <AnimatePresence>
      {projects && projects.length > 0 && (
        <motion.div
          key="select-projects"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Select
            onValueChange={handleSelect}
            value={currentProjectId || undefined}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent className="w-56" align={"start"}>
              <SelectItem value="all" key="all">
                All Projects
              </SelectItem>
              {projects.map((project) => (
                <SelectProject key={project.id} id={project.id} />
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
