import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LaunchesList } from "@/components/launches/LaunchesList";
import { LaunchDetailsPanel } from "@/components/launches/LaunchDetailsPanel";
import { useLaunches } from "@/lib/useLaunches";
import { useLaunchSelection } from "@/components/launches/LaunchSelectionContext";
import { useLaunchDetails } from "@/lib/useLaunchDetails";

vi.mock("@/lib/useLaunches");
vi.mock("@/components/launches/LaunchSelectionContext");
vi.mock("@/lib/useLaunchDetails");
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
        : [
            { index: 0, start: 0, size: 120, end: 120 },
          ],
    getTotalSize: () =>
      (mockItems.length ? mockItems.length : 1) * 128,
    scrollToIndex: vi.fn(),
    measureElement: vi.fn(),
  }),
}));
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

const useLaunchesMock = vi.mocked(useLaunches);
const useLaunchSelectionMock = vi.mocked(useLaunchSelection);
const useLaunchDetailsMock = vi.mocked(useLaunchDetails);

describe("Deep linking", () => {
  beforeEach(() => {
    // jsdom lacks scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    const launch = {
      id: "deep-link-id",
      name: "Deep Link Launch",
      date_utc: "2024-01-01T00:00:00.000Z",
      success: true,
      details: "Details",
      rocket: { name: "Falcon 9" },
      launchpad: { name: "LC-39A" },
      links: { patch: { small: null }, webcast: null, wikipedia: null },
    };

    useLaunchesMock.mockReturnValue({
      data: [launch],
      byId: new Map([[launch.id, launch]]),
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    mockItems = [
      { index: 0, start: 0, size: 120, end: 120 },
    ];

    useLaunchDetailsMock.mockReturnValue({
      data: launch,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    useLaunchSelectionMock.mockReturnValue({
      selectedId: launch.id,
      select: vi.fn(),
      clear: vi.fn(),
    });
  });

  it("renders the linked launch and marks it selected", () => {
    render(
      <>
        <LaunchesList />
        <LaunchDetailsPanel />
      </>
    );

    expect(
      screen.getByRole("heading", { name: /Deep Link Launch/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Select a launch to see details/i)
    ).not.toBeInTheDocument();

    const option = screen.getByRole("option", { name: /Deep Link Launch/i });
    expect(option).toHaveAttribute("aria-selected", "true");
  });
});
