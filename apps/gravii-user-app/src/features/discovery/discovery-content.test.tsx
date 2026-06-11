import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DiscoveryContent from "./discovery-content";

vi.mock("@/lib/auth/user-api", () => ({
  readDiscoveryCatalog: vi.fn().mockResolvedValue({
    partners: [],
  }),
  UserApiError: class UserApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

describe("DiscoveryContent", () => {
  it("keeps the discovery UI while rendering no local campaign rows", async () => {
    render(<DiscoveryContent dark connected onConnect={() => {}} onNavigate={() => {}} />);

    expect(
      screen.getByRole("heading", { name: "Discover the full spectrum of benefits." })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eligible" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search partners or campaigns…")).toBeInTheDocument();
    expect(await screen.findByText("Campaign catalog is ready for live data.")).toBeInTheDocument();
    expect(screen.queryAllByText(/campaigns? indexed/i)).toHaveLength(1);
  });

  it("does not show local campaigns when disconnected", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<DiscoveryContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(await screen.findByText("Campaign catalog is ready for live data.")).toBeInTheDocument();
    expect(screen.getByText("GET YOUR GRAVII ID")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SIGN IN" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });
});
