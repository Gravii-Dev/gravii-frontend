import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DiscoveryContent from "./discovery-content";

describe("DiscoveryContent", () => {
  it("renders partner campaign discovery when connected", async () => {
    const user = userEvent.setup();

    render(<DiscoveryContent dark connected onConnect={() => {}} onNavigate={() => {}} />);

    expect(screen.getByRole("heading", { name: "Discover the full spectrum of benefits." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Partner Alpha/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eligible" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search partners or campaigns...")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Partner Beta/i }));

    expect(screen.getByRole("button", { name: "← BACK TO DISCOVERY" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Partner Beta" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "VIEW DETAILS →" }));
    await user.click(screen.getByRole("button", { name: "HOW TO QUALIFY →" }));

    expect(screen.getByText("VERIFY MY ELIGIBILITY")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "BOOST RANKING →" })).toBeInTheDocument();
  });

  it("keeps campaigns visible behind the sign-in gate when disconnected", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<DiscoveryContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByRole("button", { name: /Partner Alpha/i })).toBeInTheDocument();
    expect(screen.getByText("GET YOUR GRAVII ID")).toBeInTheDocument();

    const gate = screen.getByRole("region", { name: "Discovery sign-in gate" });
    await user.click(within(gate).getByRole("button", { name: "SIGN IN" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });
});
