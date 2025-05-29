"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useProjects from "@/hooks/use-projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentProject } from "@/components/project-context";

export const SelectProjects = () => {
  const { data: projects } = useProjects();
  const { currentProjectId, setCurrentProjectId } = useCurrentProject();

  const handleSelect = (value: string) => {
    if (value === currentProjectId) return;
    setCurrentProjectId(value);
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
          <Select onValueChange={handleSelect} value={currentProjectId || undefined}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent className="w-56" align={"start"}>
              <SelectItem value="all" key="all">
                All Projects
              </SelectItem>
              {projects.map((project) => (
                <SelectItem value={project.id} key={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
