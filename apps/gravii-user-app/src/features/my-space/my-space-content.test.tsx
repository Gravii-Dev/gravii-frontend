import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import MySpaceContent from "./my-space-content";

describe("MySpaceContent", () => {
  it("renders the reserved dashboard state when connected", () => {
    render(<MySpaceContent dark connected onConnect={() => {}} onNavigate={() => {}} />);

    expect(screen.getByText("My Space")).toBeInTheDocument();
    expect(screen.getByText("Your private feed is being composed.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "My Space will become the personal room for matched benefits, saved claims, and concierge-style curation. The shell is ready now, while persistence and benefit matching move behind the scenes."
      )
    ).toBeInTheDocument();
  });

  it("keeps the reserved state when disconnected", () => {
    const onConnect = vi.fn();
    const onNavigate = vi.fn();

    render(<MySpaceContent dark connected={false} onConnect={onConnect} onNavigate={onNavigate} />);

    expect(screen.getByText("Your private feed is being composed.")).toBeInTheDocument();
    expect(screen.getByText("Surface reserved")).toBeInTheDocument();
    expect(screen.getByText("Live route locked")).toBeInTheDocument();
    expect(onNavigate).not.toHaveBeenCalled();
    expect(onConnect).not.toHaveBeenCalled();
  });
});
