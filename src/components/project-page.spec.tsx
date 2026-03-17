import { renderWithProviders } from "@/testing/render";
import { screen } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach } from "vitest";
import ProjectPage from "@/components/project-page";
import * as nextNavigation from "next/navigation";
import useTask from "@/hooks/use-task";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(),
}));

vi.mock("@/hooks/use-tasks", () => ({
  useTasks: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
}));

vi.mock("@/hooks/use-task", () => ({
  default: vi.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}));

vi.mock("@/hooks/use-project", () => ({
  useProject: vi.fn(() => ({
    data: {
      id: "proj123-full-uuid-here",
    },
    isLoading: false,
    error: null,
  })),
}));

vi.mock("@/hooks/use-create-session", () => ({
  default: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

describe("ProjectPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (nextNavigation.usePathname as ReturnType<typeof vi.fn>).mockReturnValue(
      "/projects/proj123"
    );
  });

  it("renders ProjectOverview when no task is selected", () => {
    renderWithProviders(<ProjectPage />);
    expect(screen.getByText(/proj123-/)).toBeInTheDocument();
  });

  it("renders TaskSidebar with empty state", () => {
    renderWithProviders(<ProjectPage />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it("renders task detail view when task is selected", () => {
    (nextNavigation.usePathname as ReturnType<typeof vi.fn>).mockReturnValue(
      "/projects/proj123/tasks/task-1"
    );

    (useTask as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("not found"),
    });

    renderWithProviders(<ProjectPage />);
    expect(screen.getByText(/task not found/i)).toBeInTheDocument();
  });
});
