import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ExpressiveCursor from ".";

function mockMatchMedia(options: { pointerFine: boolean; reducedMotion: boolean }) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("pointer: fine") ? options.pointerFine : query.includes("prefers-reduced-motion")
      ? options.reducedMotion
      : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

describe("ExpressiveCursor", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete document.documentElement.dataset.expressiveCursor;
  });

  it("enables the custom cursor for fine pointer users and reads target labels", async () => {
    mockMatchMedia({ pointerFine: true, reducedMotion: false });

    render(
      <div>
        <ExpressiveCursor />
        <button data-cursor-label="Launch" data-cursor-target="action" data-cursor-variant="pill" type="button">
          Launch
        </button>
      </div>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("expressive-cursor")).toBeInTheDocument();
    });

    fireEvent.pointerMove(screen.getByRole("button", { name: "Launch" }), {
      clientX: 128,
      clientY: 96,
    });

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-expressive-cursor", "true");
      expect(screen.getByTestId("expressive-cursor-label")).toHaveTextContent("Launch");
    });
  });

  it("stays disabled when reduced motion is requested", () => {
    mockMatchMedia({ pointerFine: true, reducedMotion: true });

    render(<ExpressiveCursor />);

    expect(screen.queryByTestId("expressive-cursor")).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveAttribute("data-expressive-cursor");
  });
});
