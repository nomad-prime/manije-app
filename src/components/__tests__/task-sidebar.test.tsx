import { renderWithProviders } from "@/testing/render";
import { screen } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach } from "vitest";
import TaskSidebar from "@/components/task-sidebar";
import { useTasks } from "@/hooks/use-tasks";
import type { AgentTask } from "@/types/tasks";

vi.mock("@/hooks/use-tasks", () => ({
  useTasks: vi.fn(),
}));

const mockOnSelect = vi.fn();

const baseTasks: AgentTask[] = [
  {
    id: "task-1",
    project_id: "proj-1",
    tenant_id: "tenant-1",
    type: "follow_up",
    description: "Write project requirements document",
    status: "completed",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "task-2",
    project_id: "proj-1",
    tenant_id: "tenant-1",
    type: "follow_up",
    description: "Design system architecture",
    status: "in_progress",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "task-3",
    project_id: "proj-1",
    tenant_id: "tenant-1",
    type: "follow_up",
    description: "Create API endpoints",
    status: "unclaimed",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
];

describe("TaskSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders follow-up tasks sorted newest first", () => {
    (useTasks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: baseTasks,
      isLoading: false,
    });

    renderWithProviders(
      <TaskSidebar projectId="proj-1" selectedTaskId={null} onSelect={mockOnSelect} />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Design system architecture");
    expect(buttons[1]).toHaveTextContent("Create API endpoints");
    expect(buttons[2]).toHaveTextContent("Write project requirements document");
  });

  it("shows status indicators for each task", () => {
    (useTasks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: baseTasks,
      isLoading: false,
    });

    const { container } = renderWithProviders(
      <TaskSidebar projectId="proj-1" selectedTaskId={null} onSelect={mockOnSelect} />
    );

    const dots = container.querySelectorAll(".rounded-full.w-2.h-2");
    expect(dots).toHaveLength(3);
  });

  it("shows empty state when no tasks", () => {
    (useTasks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(
      <TaskSidebar projectId="proj-1" selectedTaskId={null} onSelect={mockOnSelect} />
    );

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it("shows loading skeleton while loading", () => {
    (useTasks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { container } = renderWithProviders(
      <TaskSidebar projectId="proj-1" selectedTaskId={null} onSelect={mockOnSelect} />
    );

    const skeletons = container.querySelectorAll("[class*='animate-pulse']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("calls onSelect when a task is clicked", async () => {
    (useTasks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: baseTasks,
      isLoading: false,
    });

    renderWithProviders(
      <TaskSidebar projectId="proj-1" selectedTaskId={null} onSelect={mockOnSelect} />
    );

    const button = screen.getByText("Design system architecture");
    button.click();

    expect(mockOnSelect).toHaveBeenCalledWith("task-2");
  });

  it("highlights the selected task", () => {
    (useTasks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: baseTasks,
      isLoading: false,
    });

    renderWithProviders(
      <TaskSidebar projectId="proj-1" selectedTaskId="task-2" onSelect={mockOnSelect} />
    );

    const buttons = screen.getAllByRole("button");
    const selectedButton = buttons[0]; // task-2 is newest, so first
    expect(selectedButton.className).toContain("secondary");
  });

  it("passes type filter to useTasks", () => {
    (useTasks as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });

    renderWithProviders(
      <TaskSidebar projectId="proj-1" selectedTaskId={null} onSelect={mockOnSelect} />
    );

    expect(useTasks).toHaveBeenCalledWith({
      projectId: "proj-1",
      type: "follow_up",
      refetchInterval: 10_000,
    });
  });
});
