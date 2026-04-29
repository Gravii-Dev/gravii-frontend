import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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

  it("shows the same reserved state even when disconnected", () => {
    const onConnect = vi.fn();

    render(<DiscoveryContent dark connected={false} onConnect={onConnect} onNavigate={() => {}} />);

    expect(screen.getByText("Curated campaigns are being staged.")).toBeInTheDocument();
    expect(screen.getByText("Surface reserved")).toBeInTheDocument();
    expect(screen.getByText("Live route locked")).toBeInTheDocument();
    expect(onConnect).not.toHaveBeenCalled();
  });
});
