import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MySpaceContent from "./my-space-content";

describe("MySpaceContent", () => {
  it("filters campaigns by category, expands a benefit card, and records opt-in state", async () => {
    const user = userEvent.setup();

    render(<MySpaceContent dark connected onConnect={() => {}} onNavigate={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Wealth & Finance" }));

    expect(screen.getByText("Yield Booster")).toBeInTheDocument();
    expect(screen.queryByText("Community Airdrop")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Yield Booster/ }));
    await user.click(screen.getByRole("button", { name: "OPT IN →" }));

    expect(screen.getByRole("button", { name: "OPTED IN ✓" })).toBeInTheDocument();
  });

  it("shows the locked state when the wallet is not connected", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();
    const onNavigate = vi.fn();

    render(<MySpaceContent dark connected={false} onConnect={onConnect} onNavigate={onNavigate} />);

    expect(screen.getByText("GET YOUR GRAVII ID")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reveal My Profile" }));
    await user.click(screen.getByRole("button", { name: "Connect Wallet" }));

    expect(onNavigate).toHaveBeenCalledWith("profile");
    expect(onConnect).toHaveBeenCalledTimes(1);
  });
});
