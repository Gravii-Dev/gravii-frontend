import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import XRayContent from "./x-ray-content";

describe("XRayContent", () => {
  it("requires sign-in before analyzing", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<XRayContent dark={false} connected={false} onConnect={onConnect} />);

    await user.click(screen.getByRole("button", { name: "SIGN IN TO START ANALYZING" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it("opens the payment step and renders analysis results after confirmation", async () => {
    const user = userEvent.setup();

    render(<XRayContent dark={false} connected onConnect={() => {}} />);

    await user.type(screen.getByLabelText("Wallet address"), "0x123456789");
    await user.click(screen.getByRole("button", { name: "ANALYZE" }));

    expect(screen.getByRole("dialog", { name: "Confirm analysis payment" })).toBeInTheDocument();

    vi.useFakeTimers();
    await act(async () => {
      screen.getByRole("button", { name: "CONFIRM & PAY" }).click();
      await vi.advanceTimersByTimeAsync(2200);
    });

    expect(screen.getByText("ANALYZED")).toBeInTheDocument();
    expect(screen.getByText("0x123456789")).toBeInTheDocument();

    vi.useRealTimers();
  });
});
