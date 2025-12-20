import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LaunchesList } from "@/components/launches/LaunchesList";
import { useLaunches } from "@/lib/useLaunches";
import { useLaunchSelection } from "@/components/launches/LaunchSelectionContext";

vi.mock("@/lib/useLaunches");
vi.mock("@/components/launches/LaunchSelectionContext");
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ prefetchQuery: vi.fn() }),
}));
let mockItems: Array<{
  index: number;
  start: number;
  size: number;
  end: number;
}> = [];
vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: () => ({
    getVirtualItems: () =>
      mockItems.length
        ? mockItems
        : launches.map((_, index) => {
            const start = index * 128;
            const size = 120;
            return { index, start, size, end: start + size };
          }),
    getTotalSize: () =>
      (mockItems.length
        ? mockItems.length
        : launches.length) * 128,
    scrollToIndex: vi.fn(),
    measureElement: vi.fn(),
  }),
}));
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

const useLaunchesMock = vi.mocked(useLaunches);
const useLaunchSelectionMock = vi.mocked(useLaunchSelection);

const launches = [
  {
    id: "1",
    name: "Falcon 1",
    date_utc: "2024-01-01T00:00:00.000Z",
    success: true,
    rocket: { name: "Falcon 1 Rocket" },
    launchpad: { name: "Kwajalein Atoll" },
    links: { patch: { small: null }, webcast: null, wikipedia: null },
  },
  {
    id: "2",
    name: "Starship",
    date_utc: "2025-02-02T00:00:00.000Z",
    success: null,
    rocket: { name: "Starship" },
    launchpad: { name: "Starbase" },
    links: { patch: { small: null }, webcast: null, wikipedia: null },
  },
];

describe("LaunchesList", () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    useLaunchesMock.mockReturnValue({
      data: launches,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    mockItems = launches.map((_, index) => {
      const start = index * 128;
      const size = 120;
      return { index, start, size, end: start + size };
    });
  });

  it("filters by search input", async () => {
    useLaunchSelectionMock.mockReturnValue({
      selectedId: null,
      select: vi.fn(),
    });

    const user = userEvent.setup();
    render(<LaunchesList />);

    expect(screen.getByText("Falcon 1")).toBeInTheDocument();
    expect(screen.getByText("Starship")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Search launches..."), "star");

    await waitFor(() =>
      expect(screen.queryByText("Falcon 1")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Starship")).toBeInTheDocument();
  });

  it("calls select and marks item as selected", async () => {
    const state = { selectedId: null as string | null };
    const select = vi.fn((id: string) => {
      state.selectedId = id;
    });

    useLaunchSelectionMock.mockImplementation(() => ({
      selectedId: state.selectedId,
      select,
    }));

    const user = userEvent.setup();
    const { rerender } = render(<LaunchesList />);

    const [falconButton] = screen.getAllByRole("option", { name: /Falcon 1/i });
    await user.click(falconButton);
    expect(select).toHaveBeenCalledWith("1");

    // simulate selection update from context
    useLaunchSelectionMock.mockReturnValue({
      selectedId: "1",
      select,
    });
    rerender(<LaunchesList />);

    const selectedButton = screen.getAllByRole("option", { name: /Falcon 1/i })[0];
    expect(selectedButton).toHaveAttribute("aria-selected", "true");
  });
});
