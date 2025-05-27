import React, { createContext, useContext, useState, ReactNode } from "react";

type ProjectContextType = {
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  return (
    <ProjectContext.Provider value={{ currentProjectId, setCurrentProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
};
