import { renderWithProviders } from "@/testing/render";
import { screen } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach } from "vitest";
import ProjectPage from "@/components/project-page";
import * as nextNavigation from "next/navigation";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(),
}));

vi.mock("@/hooks/use-sessions", () => ({
  default: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock("@/hooks/use-create-session", () => ({
  default: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

vi.mock("@/hooks/use-notifications", () => ({
  useNotifications: vi.fn(),
}));

vi.mock("@/hooks/use-tasks", () => ({
  useTasks: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock("@/hooks/use-assets", () => ({
  useAssets: vi.fn(() => ({ data: [], isLoading: false })),
}));

describe("ProjectPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (nextNavigation.usePathname as ReturnType<typeof vi.fn>).mockReturnValue(
      "/projects/proj123"
    );
  });

  it("shows the conversations sidebar on the project root", () => {
    renderWithProviders(<ProjectPage />);
    expect(screen.getByText(/conversations/i)).toBeInTheDocument();
  });

  it("shows the dashboard on the project root", () => {
    renderWithProviders(<ProjectPage />);
    expect(screen.getByText(/project health/i)).toBeInTheDocument();
  });

  it("renders the dashboard when the pathname includes /dashboard", () => {
    (nextNavigation.usePathname as ReturnType<typeof vi.fn>).mockReturnValue(
      "/projects/proj123/dashboard"
    );
    renderWithProviders(<ProjectPage />);
    expect(screen.getByText(/project health/i)).toBeInTheDocument();
  });
});
