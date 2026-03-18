import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DiscoveryContent from "./discovery-content";

describe("DiscoveryContent", () => {
  it("filters partners by category and opens a partner detail view", async () => {
    const user = userEvent.setup();

    render(<DiscoveryContent dark connected onConnect={() => {}} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Wealth & Finance" }));

    expect(screen.getByText("Partner Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Partner Zeta")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open Partner Alpha" }));

    expect(screen.getByRole("button", { name: "Back to Discovery" })).toBeInTheDocument();
    expect(screen.getByText("CAMPAIGNS (2)")).toBeInTheDocument();
  });

  it("shows the locked state when the wallet is not connected", () => {
    const onConnect = vi.fn();

    render(<DiscoveryContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByText("GET YOUR GRAVII ID")).toBeInTheDocument();
    expect(screen.getByText("Unlock benefits curated just for you.")).toBeInTheDocument();
    expect(screen.getByText(/Connect →/)).toBeInTheDocument();
  });
});
