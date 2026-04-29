import { describe, expect, it } from "vitest";

import { mapXrayDetailToViewModel } from "./x-ray-view-model";

describe("mapXrayDetailToViewModel", () => {
  it("maps engine chain breakdown objects into display rows", () => {
    const detail = mapXrayDetailToViewModel({
      xray: {
        address: "0x4a2cba8a53e49c799c3d01c0e9af2e18cd75925b",
        activity_90d: {
          chains_active: 7,
          total_transactions: 120,
        },
        defi: {
          protocols_count: 1,
          total_tvl_usd: 0,
        },
        identity: {
          first_active: "Dec 2023",
          portfolio_trend_30d: -91.1,
          reputation: "neutral",
          tier: "classic",
        },
        personas: {
          adjacent_personas: [],
          top_persona: "Chain Hopper",
        },
        portfolio: {
          by_chain: {
            abstract: 0.8307471721346338,
            "binance-smart-chain": 6.478135446585914,
            ethereum: 3.1009584768944967,
          },
          total_value_usd: 13.041391879551163,
        },
        trading: {
          volume_30d_usd: 429.68,
        },
      },
    });

    expect(detail.primaryPersona).toBe("Chain Hopper");
    expect(detail.totalValue).toBe("$13.04");
    expect(detail.transactions90d).toBe("120");
    expect(detail.portfolioTrend30d).toBe("-91.1%");
    expect(detail.byChain).toEqual([
      { chain: "Binance Smart Chain", value: "$6.48" },
      { chain: "Ethereum", value: "$3.10" },
      { chain: "Abstract", value: "$0.83" },
    ]);
  });

  it("unwraps nested or stringified X-Ray payloads from the User API detail response", () => {
    const detail = mapXrayDetailToViewModel({
      xray: {
        xray: JSON.stringify({
          address: "0x4a2cba8a53e49c799c3d01c0e9af2e18cd75925b",
          activity_90d: {
            chains_active: 7,
            total_transactions: 120,
          },
          identity: {
            first_active: "Dec 2023",
            reputation: "neutral",
            tier: "classic",
          },
          personas: {
            top_persona: "Chain Hopper",
          },
          portfolio: {
            total_value_usd: 13.041391879551163,
          },
          trading: {
            volume_30d_usd: 429.68,
          },
        }),
      },
    });

    expect(detail.address).toBe("0x4a2cba8a53e49c799c3d01c0e9af2e18cd75925b");
    expect(detail.primaryPersona).toBe("Chain Hopper");
    expect(detail.tier).toBe("Classic");
    expect(detail.activeChains).toBe(7);
    expect(detail.tradingVolume30d).toBe("$429.68");
  });
});
