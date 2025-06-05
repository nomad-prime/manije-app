import { renderWithProviders } from "@/testing/render";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach } from "vitest";
import ProjectPage from "@/components/project-page";
import * as nextNavigation from "next/navigation";
import useCreateJob from "@/hooks/use-create-job-stream";
import useJob from "@/hooks/use-job";
import useJobs from "@/hooks/use-jobs";
import useJobType from "@/hooks/use-job-type";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(),
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

describe("ProjectPage", () => {
  beforeEach(() => {
    (nextNavigation.useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      slugs: ["proj123", "jobs", "job456"],
    });

    (useCreateJob as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
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
        output_schema: { example: "string" },
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
    expect(await screen.findByText(/LLM output summary/i)).toBeInTheDocument();
  });

  it("submits prompt via FloatingPromptInput and updates URL", async () => {
      (nextNavigation.useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      slugs: ["proj123", "jobs"],
    });

    renderWithProviders(<ProjectPage />);
    const textarea = await screen.findByPlaceholderText("Let's start...");

    fireEvent.change(textarea, { target: { value: "My prompt" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(window.history.pushState).toHaveBeenCalledWith(
        {},
        "",
        "/projects/proj123/jobs/newJobId",
      );
    });
  });

  it("renders PromptInput when no jobId is present", () => {
    (nextNavigation.useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      slugs: ["proj123"],
    });

    renderWithProviders(<ProjectPage />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("submits prompt via PromptInput and updates URL", async () => {
    (nextNavigation.useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      slugs: ["proj123"],
    });

    renderWithProviders(<ProjectPage />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "Write summary" } });
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(window.history.pushState).toHaveBeenCalledWith(
        {},
        "",
        "/projects/proj123/jobs/newJobId",
      );
    });
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
