import React, {createContext, useContext, useState, ReactNode, useEffect} from "react";

const SESSION_STORAGE_KEY = "currentProjectId_session";
const LOCAL_STORAGE_KEY = "lastUsedProjectId";

type ProjectContextType = {
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useCurrentProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [currentProjectId, _setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // First try sessionStorage (current tab)
    const sessionProjectId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionProjectId) {
      _setCurrentProjectId(sessionProjectId);
      return;
    }

    // If no session project, try localStorage (last used project)
    const lastProjectId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lastProjectId) {
      _setCurrentProjectId(lastProjectId);
      sessionStorage.setItem(SESSION_STORAGE_KEY, lastProjectId);
      return;
    }
  }, []);

  const setCurrentProjectId = (id: string | null) => {
    if (id === null) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      _setCurrentProjectId(null);
      return;
    }
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    localStorage.setItem(LOCAL_STORAGE_KEY, id);
    _setCurrentProjectId(id);
  };

  return (
    <ProjectContext.Provider value={{ currentProjectId, setCurrentProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
};
