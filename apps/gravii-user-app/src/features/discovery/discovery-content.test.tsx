import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DiscoveryContent from "./discovery-content";

describe("DiscoveryContent", () => {
  it("renders the reserved dashboard state when connected", () => {
    render(<DiscoveryContent dark connected onConnect={() => {}} onNavigate={() => {}} />);

    expect(screen.getByText("Discovery")).toBeInTheDocument();
    expect(screen.getByText("Curated campaigns are being staged.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Discovery is reserved for verified partner drops that can be ranked by persona, eligibility, and wallet context. The surface is ready; campaign inventory and claim actions will attach as the backend contract stabilizes."
      )
    ).toBeInTheDocument();
  });

  it("keeps the structure visible and overlays sign-in when disconnected", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<DiscoveryContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByText("Curated campaigns are being staged.")).toBeInTheDocument();
    expect(screen.getByText("Surface reserved")).toBeInTheDocument();
    expect(screen.getByText("Live route locked")).toBeInTheDocument();
    expect(screen.getByText("Sign in to match campaigns")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "SIGN IN" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });
});
