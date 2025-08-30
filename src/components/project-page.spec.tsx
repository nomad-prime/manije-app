import { renderWithProviders } from "@/testing/render";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach } from "vitest";
import ProjectPage from "@/components/project-page";
import * as nextNavigation from "next/navigation";
import useCreateJobStream from "@/hooks/use-create-job-stream";
import useJob from "@/hooks/use-job";
import useJobs from "@/hooks/use-jobs";
import useJobType from "@/hooks/use-job-type";
import { useProject } from "@/hooks/use-project";
import useNextJobs from "@/hooks/use-next-jobs";
import { useNextJobsSSE } from "@/hooks/use-next-jobs-sse";
import useCreateNextJobs from "@/hooks/use-create-next-jobs";
import useTaskStatus from "@/hooks/use-task-status";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("@/hooks/use-create-job-stream", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/use-job", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/use-jobs", () => ({
  default: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
}));

vi.mock("@/hooks/use-job-type", () => ({
  default: vi.fn(() => ({
    data: {},
  })),
}));

vi.mock("@/hooks/use-project", () => ({
  useProject: vi.fn(() => ({
    data: {
      data: {
        name: "Test Project",
        description: "Test project description",
      },
    },
    isLoading: false,
    error: null,
  })),
}));

vi.mock("@/hooks/use-next-jobs", () => ({
  default: vi.fn(() => ({
    data: [],
    isLoading: true,
  })),
}));

vi.mock("@/hooks/use-next-jobs-sse", () => ({
  useNextJobsSSE: vi.fn(() => ({
    connectionStatus: "connected",
    error: null,
  })),
}));

vi.mock("@/hooks/use-create-next-jobs", () => ({
  default: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

vi.mock("@/hooks/use-task-status", () => ({
  default: vi.fn(() => ({
    isTaskRunning: false,
    isTaskCompleted: false,
    isTaskFailed: false,
  })),
}));

describe("ProjectPage", () => {
  beforeEach(() => {
    (nextNavigation.useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      slugs: ["proj123", "jobs", "job456"],
    });

    (nextNavigation.usePathname as ReturnType<typeof vi.fn>).mockReturnValue(
      "/projects/proj123/jobs/job456"
    );

    (useCreateJobStream as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: vi.fn(async () => ({ id: "newJobId" })),
      isPending: false,
    });

    (useJobType as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: "jt1",
        name: "Job Type 1",
        description: "Description for job type 1",
        system_prompt: "System prompt for job type 1",
        user_prompt: "User prompt for job type 1",
        model: "gpt-3.5-turbo",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    (useJob as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: "job456",
        job_type_id: "jt1",
        output: { summary: "LLM output summary" },
        stage: "ready_for_review",
      },
      isLoading: false,
    });

    (useJobs as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [
        {
          id: "job456",
          job_type_id: "jt1",
          title: "Some Job Title",
          stage: "ready_for_review",
        },
      ],
      isLoading: false,
    });

    vi.stubGlobal("window", Object.create(window));
    vi.spyOn(window.history, "pushState");
  });

  it("renders JobCard when jobId is present", async () => {
    renderWithProviders(<ProjectPage />);
    expect(await screen.findByDisplayValue(/LLM output summary/i)).toBeInTheDocument();
  });

  it("renders ProjectOverview when no jobId is present", () => {
    (nextNavigation.useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      slugs: ["proj123"],
    });
    (nextNavigation.usePathname as ReturnType<typeof vi.fn>).mockReturnValue(
      "/projects/proj123"
    );

    renderWithProviders(<ProjectPage />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("Test project description")).toBeInTheDocument();
  });

  it("handles job selection from JobList", async () => {
    renderWithProviders(<ProjectPage />);

    // simulate clicking a job from the list
    const jobButton = await screen.findByRole("button", {
      name: /some job title/i,
    });

    fireEvent.click(jobButton);

    await waitFor(() => {
      expect(window.history.pushState).toHaveBeenCalledWith(
        {},
        "",
        expect.stringMatching(/\/projects\/proj123\/jobs\/.+/),
      );
    });
  });
});
