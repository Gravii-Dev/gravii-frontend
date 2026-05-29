import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StandingContent from "./standing-content";

describe("StandingContent", () => {
  it("keeps the ranking UI while gating wallet-specific rank", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<StandingContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByRole("heading", { name: "See where you stand." })).toBeInTheDocument();
    expect(screen.getByText("Season")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "G-REP" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "NFT" })).toBeInTheDocument();
    expect(screen.getByText("Get your Gravii ID")).toBeInTheDocument();
    expect(screen.getByText("Public leaderboard data is not connected yet.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SIGN IN" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it("routes connected users back to Gravii ID", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<StandingContent dark connected onConnect={() => {}} onNavigate={onNavigate} />);

    expect(screen.getByText("Connected wallet")).toBeInTheDocument();
    expect(screen.getByText("Season rank")).toBeInTheDocument();
    expect(screen.getByText("Season best")).toBeInTheDocument();
    expect(screen.getByText("Season change")).toBeInTheDocument();
    expect(screen.getAllByText("Pending API").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "REVIEW GRAVII ID" }));

    expect(onNavigate).toHaveBeenCalledWith("profile");
  });
});
