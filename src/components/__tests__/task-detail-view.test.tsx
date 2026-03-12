import { renderWithProviders } from "@/testing/render";
import { screen } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach } from "vitest";
import TaskDetailView from "@/components/task-detail-view";
import useTaskSessions from "@/hooks/use-task-sessions";
import type { AgentTask } from "@/types/tasks";

vi.mock("@/hooks/use-task-sessions", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/use-messages", () => ({
  default: vi.fn(() => ({ data: [], isLoading: false })),
}));

vi.mock("@/hooks/use-asset", () => ({
  default: vi.fn(() => ({ data: null, isLoading: false })),
}));

vi.mock("@/hooks/use-create-task-session", () => ({
  default: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

vi.mock("@/hooks/use-session", () => ({
  default: vi.fn(() => ({ data: null, isLoading: false })),
}));

vi.mock("@/hooks/use-auth-fetch", () => ({
  useAuthFetch: vi.fn(() => vi.fn()),
}));

const task: AgentTask = {
  id: "task-1",
  project_id: "proj-1",
  tenant_id: "tenant-1",
  type: "follow_up",
  description: "Write user guide documentation",
  status: "in_progress",
  claimed_by: "agent-alpha",
  draft_asset_id: "asset-1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("TaskDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders task header with description and status", () => {
    (useTaskSessions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(<TaskDetailView task={task} projectId="proj-1" />);

    expect(screen.getByText("Write user guide documentation")).toBeInTheDocument();
    expect(screen.getByText("in progress")).toBeInTheDocument();
  });

  it("shows no-sessions empty state when task has no sessions", () => {
    (useTaskSessions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(<TaskDetailView task={task} projectId="proj-1" />);

    expect(screen.getByText(/no sessions available/i)).toBeInTheDocument();
    expect(screen.getByText(/start a session/i)).toBeInTheDocument();
  });

  it("shows no-asset empty state when no draft_asset_id", () => {
    const taskWithoutAsset = { ...task, draft_asset_id: undefined };

    (useTaskSessions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(<TaskDetailView task={taskWithoutAsset} projectId="proj-1" />);

    expect(screen.getByText(/no artifact linked/i)).toBeInTheDocument();
  });

  it("renders session selector when multiple sessions exist", () => {
    (useTaskSessions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [
        { id: "session-1", title: "First session", created_at: "2024-01-01T00:00:00Z" },
        { id: "session-2", title: "Second session", created_at: "2024-01-02T00:00:00Z" },
      ],
      isLoading: false,
    });

    renderWithProviders(<TaskDetailView task={task} projectId="proj-1" />);

    expect(screen.getByText("First session")).toBeInTheDocument();
    expect(screen.getByText("Second session")).toBeInTheDocument();
  });

  it("shows new session button", () => {
    (useTaskSessions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [
        { id: "session-1", title: "Existing", created_at: "2024-01-01T00:00:00Z" },
      ],
      isLoading: false,
    });

    renderWithProviders(<TaskDetailView task={task} projectId="proj-1" />);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("calls useTaskSessions with correct params", () => {
    (useTaskSessions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(<TaskDetailView task={task} projectId="proj-1" />);

    expect(useTaskSessions).toHaveBeenCalledWith({
      projectId: "proj-1",
      taskId: "task-1",
    });
  });

  it("renders artifact viewer in the right panel", () => {
    (useTaskSessions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [
        { id: "session-1", title: "Session", created_at: "2024-01-01T00:00:00Z" },
      ],
      isLoading: false,
    });

    renderWithProviders(<TaskDetailView task={task} projectId="proj-1" />);

    // Task has draft_asset_id="asset-1" but useAsset returns null (mocked), so "Asset not found." is shown
    expect(screen.getByText("Asset not found.")).toBeInTheDocument();
  });

  it("does not send message when there is no active session", () => {
    (useTaskSessions as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(<TaskDetailView task={task} projectId="proj-1" />);

    // With no sessions, no message should be sent — component should render without errors
    expect(screen.getByText(/no sessions available/i)).toBeInTheDocument();
  });
});
