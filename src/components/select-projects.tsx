"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CustomButton } from "@/components/ui/custom-button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useProjects from "@/hooks/use-projects";

export const SelectProjects = () => {
  const { data: projects } = useProjects();

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CustomButton variant="outline">
                Projects
                <ChevronDown />
              </CustomButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align={"start"}>
              {projects.map((project) => (
                <DropdownMenuItem key={project.id}>
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
