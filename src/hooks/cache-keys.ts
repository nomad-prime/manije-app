export const queryKeys = {
  jobs: {
    all: (projectId?: string | null) =>
      projectId ? ["jobs", projectId] : ["jobs"],
    id: (id: string | null) => (id ? ["job", id] : []),
    latest: (projectId: string | null) =>
      projectId ? ["latestJob", projectId] : [],
  },
  jobTypes: {
    all: () => ["jobTypes"],
    id: (id: string | null) => (id ? ["jobType", id] : []),
  },
  projects: {
    all: () => ["projects"],
    id: (id: string | null) => (id ? ["project", id] : []),
  },
  actions: {
    all: () => ["actions"],
    id: (id: string | null) => (id ? ["action", id] : []),
  },
  nextJobs: {
    all: (projectId: string) => (projectId ? ["nextJobs", projectId] : ["nextJobs"]),
    id: (id: string | null) => (id ? ["nextJob", id] : []),
  },
  taskStatus: (taskId: string | null) => (taskId ? ["taskStatus", taskId] : []),
  sessions: {
    all: (projectId?: string | null) =>
      projectId ? ["sessions", projectId] : ["sessions"],
    id: (id: string | null) => (id ? ["session", id] : []),
    messages: (sessionId: string | null) =>
      sessionId ? ["session", sessionId, "messages"] : [],
  },
};
