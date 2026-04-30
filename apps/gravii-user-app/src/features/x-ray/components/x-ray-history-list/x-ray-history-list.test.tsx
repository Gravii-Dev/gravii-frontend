import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import XRayHistoryList from ".";

describe("XRayHistoryList", () => {
  it("renders same-day repeat wallet lookups without duplicate React keys", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    try {
      render(
        <XRayHistoryList
          currentPage={0}
          dark={false}
          onPageChange={() => {}}
          onSelect={() => {}}
          rows={[
            {
              date: "Apr 22, 2026",
              id: "0x4788b3c38dcd920f9b3542cb8da683fee52eff0b-2026-04-22T01:00:00.000Z-0-0",
              persona: "Strategic Holder",
              wallet: "0x4788...ff0b",
              walletAddress: "0x4788b3c38dcd920f9b3542cb8da683fee52eff0b",
            },
            {
              date: "Apr 22, 2026",
              id: "0x4788b3c38dcd920f9b3542cb8da683fee52eff0b-2026-04-22T02:00:00.000Z-0-1",
              persona: "Strategic Holder",
              wallet: "0x4788...ff0b",
              walletAddress: "0x4788b3c38dcd920f9b3542cb8da683fee52eff0b",
            },
          ]}
          totalCount={2}
          totalPages={1}
        />
      );

      const duplicateKeyWarnings = consoleError.mock.calls.filter(([message]) => {
        return (
          typeof message === "string" &&
          message.includes("Encountered two children with the same key")
        );
      });

      expect(screen.getAllByRole("button", { name: /Apr 22, 2026/i })).toHaveLength(2);
      expect(duplicateKeyWarnings).toHaveLength(0);
    } finally {
      consoleError.mockRestore();
    }
  });
});
