import { renderWithProviders } from "@/testing/render";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, it, expect, describe, beforeEach } from "vitest";
import ArtifactViewer from "@/components/artifact-viewer";
import useAsset from "@/hooks/use-asset";

vi.mock("@/hooks/use-asset", () => ({
  default: vi.fn(),
}));

const mockMutateAsync = vi.fn();

vi.mock("@/hooks/use-update-asset", () => ({
  default: vi.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  })),
}));

const mockApproveMutateAsync = vi.fn();

vi.mock("@/hooks/use-approve-asset", () => ({
  default: vi.fn(() => ({
    mutateAsync: mockApproveMutateAsync,
    isPending: false,
  })),
}));

const asset = {
  id: "asset-1",
  project_id: "proj-1",
  tenant_id: "tenant-1",
  type: "document",
  title: "Project Requirements",
  description: "Main requirements document",
  content: "# Requirements\n\n- Feature A\n- Feature B",
  status: "pending_review",
  tool_call_id: "",
  created_by: "user-1",
  updated_by: "user-1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("ArtifactViewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutateAsync.mockResolvedValue({ ...asset, content: "updated" });
  });

  it("renders markdown content in read mode", () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    expect(screen.getByText("Project Requirements")).toBeInTheDocument();
    expect(screen.getByTestId("artifact-rendered")).toBeInTheDocument();
  });

  it("switches to textarea when rendered content is clicked", () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    fireEvent.click(screen.getByTestId("artifact-rendered"));

    expect(screen.getByTestId("artifact-editor")).toBeInTheDocument();
    expect(screen.getByTestId("artifact-editor")).toHaveValue(asset.content);
  });

  it("shows save and discard buttons when content has changed", () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    fireEvent.click(screen.getByTestId("artifact-rendered"));
    fireEvent.change(screen.getByTestId("artifact-editor"), {
      target: { value: "New content" },
    });

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Discard")).toBeInTheDocument();
  });

  it("calls useUpdateAsset on confirm", async () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    fireEvent.click(screen.getByTestId("artifact-rendered"));
    fireEvent.change(screen.getByTestId("artifact-editor"), {
      target: { value: "Updated content" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        assetId: "asset-1",
        content: "Updated content",
      });
    });
  });

  it("reverts content on discard", () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    fireEvent.click(screen.getByTestId("artifact-rendered"));
    fireEvent.change(screen.getByTestId("artifact-editor"), {
      target: { value: "Changed content" },
    });
    fireEvent.click(screen.getByText("Discard"));

    expect(screen.getByTestId("artifact-rendered")).toBeInTheDocument();
    expect(screen.queryByTestId("artifact-editor")).not.toBeInTheDocument();
  });

  it("does not allow editing when status is active", () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { ...asset, status: "active" },
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    fireEvent.click(screen.getByTestId("artifact-rendered"));

    expect(screen.queryByTestId("artifact-editor")).not.toBeInTheDocument();
    expect(screen.getByTestId("artifact-rendered")).toBeInTheDocument();
  });

  it("shows empty state when no asset ID", () => {
    renderWithProviders(<ArtifactViewer assetId={null} projectId="proj-1" />);

    expect(screen.getByText(/no artifact linked/i)).toBeInTheDocument();
  });

  it("shows approve button when status is pending_review", () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    expect(screen.getByText("Approve")).toBeInTheDocument();
  });

  it("hides approve button when status is active", () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { ...asset, status: "active" },
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    expect(screen.queryByText("Approve")).not.toBeInTheDocument();
  });

  it("calls approve on approve button click", async () => {
    mockApproveMutateAsync.mockResolvedValue({});
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    fireEvent.click(screen.getByText("Approve"));

    await waitFor(() => {
      expect(mockApproveMutateAsync).toHaveBeenCalled();
    });
  });

  it("calls onAssetSaved callback after successful save", async () => {
    const onAssetSaved = vi.fn();
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(
      <ArtifactViewer assetId="asset-1" projectId="proj-1" onAssetSaved={onAssetSaved} />
    );

    fireEvent.click(screen.getByTestId("artifact-rendered"));
    fireEvent.change(screen.getByTestId("artifact-editor"), {
      target: { value: "Updated content" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        assetId: "asset-1",
        content: "Updated content",
      });
      expect(onAssetSaved).toHaveBeenCalledWith("Updated content");
    });
  });

  it("does not call onAssetSaved when callback is not provided", async () => {
    (useAsset as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: asset,
      isLoading: false,
    });

    renderWithProviders(<ArtifactViewer assetId="asset-1" projectId="proj-1" />);

    fireEvent.click(screen.getByTestId("artifact-rendered"));
    fireEvent.change(screen.getByTestId("artifact-editor"), {
      target: { value: "Updated content" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });
  });
});
