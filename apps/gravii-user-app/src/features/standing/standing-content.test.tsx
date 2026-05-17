import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StandingContent from "./standing-content";

describe("StandingContent", () => {
  it("shows public rankings while gating the personal wallet rank", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<StandingContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByText("Wallet ranks stay visible. Personal rank needs sign-in.")).toBeInTheDocument();
    expect(screen.getByText("#001")).toBeInTheDocument();
    expect(screen.getByText("Want to know your rank?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SIGN IN" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it("routes connected users back to Gravii ID from the personal rank area", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();

    render(<StandingContent dark connected onConnect={() => {}} onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "REVIEW GRAVII ID" }));

    expect(onNavigate).toHaveBeenCalledWith("profile");
  });
});
