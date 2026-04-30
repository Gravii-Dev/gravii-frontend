import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import XRayContent from "./x-ray-content";

vi.mock("@/lib/auth/user-api", () => ({
  popPendingXrayWallet: vi.fn(() => null),
  readUserCredits: vi.fn(async () => 9),
  readUserLookupList: vi.fn(async () => ({
    count: 1,
    lookups: [
      {
        address: "0x1234567890123456789012345678901234567890",
        analyzedAt: "2026-04-05T20:29:53.047Z",
        tier: "classic",
        topPersona: "Chain Hopper",
      },
    ],
  })),
  readUserXrayDetail: vi.fn(async (address: string) => ({
    xray: {
      address,
      personas: {
        top_persona: "Chain Hopper",
        adjacent_personas: ["Strategic Holder"],
      },
      identity: {
        tier: "classic",
        first_active: "Dec 2023",
        reputation: "neutral",
        reputation_flags: [],
        portfolio_trend_30d: 12.4,
      },
      portfolio: {
        total_value_usd: 1234,
        by_chain: [{ chain: "ethereum", value_usd: 1000 }],
      },
      activity_90d: {
        total_transactions: 10,
        chains_active: 2,
        recent_transactions: [],
      },
      trading: {
        volume_30d_usd: 500,
      },
      defi: {
        total_tvl_usd: 250,
        protocols_count: 1,
      },
    },
  })),
  runUserXrayLookup: vi.fn(async (address: string) => ({
    address,
    creditUsed: true,
    creditsRemaining: 8,
    success: true,
  })),
}));

describe("XRayContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires sign-in before analyzing", async () => {
    const user = userEvent.setup();
    const onConnect = vi.fn();

    render(<XRayContent dark={false} connected={false} onConnect={onConnect} />);

    await user.click(screen.getByRole("button", { name: "RESTORE SESSION TO START ANALYZING" }));

    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it("loads credits and renders live X-Ray detail after analysis", async () => {
    const user = userEvent.setup();

    render(<XRayContent dark={false} connected onConnect={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("9 credits remaining")).toBeInTheDocument();
    });

    await user.type(
      screen.getByLabelText("Wallet address"),
      "0x1234567890123456789012345678901234567890"
    );

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "ANALYZE" }));
    });

    await waitFor(() => {
      expect(screen.getByText("ANALYZED")).toBeInTheDocument();
    });

    expect(
      screen.getByText("0x1234567890123456789012345678901234567890")
    ).toBeInTheDocument();
    expect(screen.getByText("Chain Hopper")).toBeInTheDocument();
  });
});
