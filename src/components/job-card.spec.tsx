import { renderWithProviders } from "@/testing/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import JobCard from "@/components/job-card";
import useJob from "@/hooks/use-job";
import useJobType from "@/hooks/use-job-type";

vi.mock("@/hooks/use-job", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/use-job-type", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/use-update-job", () => ({
  default: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mock("@/hooks/use-execute-action", () => ({
  useExecuteAction: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
}));

describe("JobCard", () => {
  it("should render job output once loaded", async () => {
    const mockUseJob = useJob as unknown as ReturnType<typeof vi.fn>;
    mockUseJob.mockReturnValue({
      data: null,
      isLoading: true,
    });

    const mockUseJobType = useJobType as unknown as ReturnType<typeof vi.fn>;
    mockUseJobType.mockReturnValue({
      data: {
        id: "type-1",
        name: "Test Job Type",
        description: "A test job type.",
        system_prompt: "System prompt for testing.",
        user_prompt: "User prompt for testing.",
        model: "test-model",
      },
    });

    const { rerender } = renderWithProviders(<JobCard jobId="job-123" />);
    expect(screen.queryByDisplayValue("Generated summary.")).toBeNull();

    // Mock job data loaded later
    mockUseJob.mockReturnValue({
      data: {
        id: "job-123",
        job_type_id: "type-1",
        output: { summary: "Generated summary." },
        next_jobs: [],
        post_job_actions: [],
        stage: "ready_for_review",
        project_id: "proj-1",
      },
    });

    rerender(<JobCard jobId="job-123" />);

    await waitFor(() =>
      expect(
        screen.getByDisplayValue("Generated summary."),
      ).toBeInTheDocument(),
    );
  });
});
