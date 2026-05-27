import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StandingContent from "./standing-content";

describe("StandingContent", () => {
  it("keeps the ranking UI while gating wallet-specific rank", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<StandingContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByRole("heading", { name: "See where every wallet stands." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Wealth" })).toBeInTheDocument();
    expect(screen.getByText("Rank hidden")).toBeInTheDocument();
    expect(screen.getByText("Public leaderboard data is not connected yet.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SIGN IN" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it("routes connected users back to Gravii ID", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<StandingContent dark connected onConnect={() => {}} onNavigate={onNavigate} />);

    expect(screen.getByText("Connected wallet")).toBeInTheDocument();
    expect(screen.getAllByText("Pending API").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "REVIEW GRAVII ID" }));

    expect(onNavigate).toHaveBeenCalledWith("profile");
  });
});
