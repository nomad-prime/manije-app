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
    id: (id: string) => ["project", id],
  },
};
