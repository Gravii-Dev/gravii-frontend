import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StandingContent from "./standing-content";

describe("StandingContent", () => {
  it("shows category rankings while gating the personal wallet rank", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<StandingContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByRole("heading", { name: "See where every wallet stands." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Wealth" })).toBeInTheDocument();
    expect(screen.getByText("Rank hidden")).toBeInTheDocument();
    expect(screen.getByText("Benji")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SIGN IN" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it("switches boards and routes connected users back to Gravii ID", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<StandingContent dark connected onConnect={() => {}} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Trade" }));

    expect(screen.getAllByText("Trading volume, timing, and execution behavior.").length).toBeGreaterThan(0);
    expect(screen.getByText("#12,340")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "REVIEW GRAVII ID" }));

    expect(onNavigate).toHaveBeenCalledWith("profile");
  });
});
