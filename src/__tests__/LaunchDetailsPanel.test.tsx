import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LaunchDetailsPanel } from "@/components/launches/LaunchDetailsPanel";
import { useLaunchSelection } from "@/components/launches/LaunchSelectionContext";
import { useLaunchDetails } from "@/lib/useLaunchDetails";

vi.mock("@/components/launches/LaunchSelectionContext");
vi.mock("@/lib/useLaunchDetails");

const useLaunchSelectionMock = vi.mocked(useLaunchSelection);
const useLaunchDetailsMock = vi.mocked(useLaunchDetails);

describe("LaunchDetailsPanel", () => {
  it("renders prompt when there is no selection", () => {
    useLaunchSelectionMock.mockReturnValue({
      selectedId: null,
      clear: vi.fn(),
    });
    useLaunchDetailsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
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
      rocket: { name: "Falcon Heavy" },
      launchpad: { name: "LC-39A" },
      links: { patch: { small: null }, webcast: null, wikipedia: null },
    };

    useLaunchSelectionMock.mockReturnValue({
      selectedId: launch.id,
      clear: vi.fn(),
    });
    useLaunchDetailsMock.mockReturnValue({
      data: launch,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<LaunchDetailsPanel />);

    expect(screen.getByText("Demo Launch")).toBeInTheDocument();
  });
});
