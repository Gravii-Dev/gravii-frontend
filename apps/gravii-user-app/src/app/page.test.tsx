import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HomePage from "./page";

const signOut = vi.fn();

vi.mock("@/features/auth/auth-provider", () => {
  return {
    useUserAuth: () => ({
      beginSignIn: vi.fn(),
      isAuthenticated: true,
      refreshSession: vi.fn(),
      signOut,
      status: "authenticated",
      user: {
        address: "0x7a3b9f2c11111111111111111111111111111111",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        referralCode: "GRAVII",
        referredUsersCount: 0,
      },
    }),
  };
});

describe("HomePage", () => {
  it("calls sign out from the session button", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const authButton = screen.getByRole("button", { name: "SIGN OUT" });

    await user.click(authButton);

    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it("opens a panel and closes it from the shell action", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    await user.click(screen.getByRole("button", { name: "DISCOVERY panel" }));

    expect(screen.getByRole("button", { name: "CLOSE ×" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "CLOSE ×" }));

    expect(screen.queryByRole("button", { name: "CLOSE ×" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "DISCOVERY panel" })).toBeInTheDocument();
  });
});
