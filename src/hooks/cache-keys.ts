export const queryKeys = {
  jobs: {
    all: () => ["jobs"],
    id: (id: string) => ["job", id],
  },
  jobTypes: {
    all: () => ["jobTypes"],
    id: (id: string) => ["jobType", id],
  },
};
