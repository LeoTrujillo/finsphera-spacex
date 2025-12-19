import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LaunchDetailsPanel } from "@/components/launches/LaunchDetailsPanel";
import { useLaunchSelection } from "@/components/launches/LaunchSelectionContext";
import { useLaunches } from "@/lib/useLaunches";

vi.mock("@/components/launches/LaunchSelectionContext");
vi.mock("@/lib/useLaunches");

const useLaunchSelectionMock = vi.mocked(useLaunchSelection);
const useLaunchesMock = vi.mocked(useLaunches);

describe("LaunchDetailsPanel", () => {
  it("renders prompt when there is no selection", () => {
    useLaunchSelectionMock.mockReturnValue({
      selectedId: null,
      clear: vi.fn(),
    });
    useLaunchesMock.mockReturnValue({
      byId: new Map(),
      isLoading: false,
    });

    render(<LaunchDetailsPanel />);

    expect(
      screen.getByText(/Select a launch to see details/i)
    ).toBeInTheDocument();
  });

  it("renders launch name when selection exists", () => {
    const launch = {
      id: "99",
      name: "Demo Launch",
      date_utc: "2024-03-03T00:00:00.000Z",
      success: true,
      details: "Test details",
      links: { patch: { small: null }, webcast: null, wikipedia: null },
    };

    useLaunchSelectionMock.mockReturnValue({
      selectedId: launch.id,
      clear: vi.fn(),
    });
    useLaunchesMock.mockReturnValue({
      byId: new Map([[launch.id, launch]]),
      isLoading: false,
    });

    render(<LaunchDetailsPanel />);

    expect(screen.getByText("Demo Launch")).toBeInTheDocument();
  });
});
