import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DiscoveryContent from "./discovery-content";

describe("DiscoveryContent", () => {
  it("keeps the discovery UI while rendering no local campaign rows", () => {
    render(<DiscoveryContent dark connected onConnect={() => {}} onNavigate={() => {}} />);

    expect(
      screen.getByRole("heading", { name: "Discover the full spectrum of benefits." })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eligible" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search partners or campaigns…")).toBeInTheDocument();
    expect(screen.getByText("Campaign catalog is waiting for live data.")).toBeInTheDocument();
    expect(screen.queryAllByText(/campaigns? indexed/i)).toHaveLength(1);
  });

  it("does not show local campaigns when disconnected", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<DiscoveryContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByText("Campaign catalog is waiting for live data.")).toBeInTheDocument();
    expect(screen.getByText("GET YOUR GRAVII ID")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SIGN IN" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });
});
