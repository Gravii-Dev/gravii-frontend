import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HomePage from "./page";

type MockAuthState = {
  isAuthenticated: boolean;
  status: "loading" | "authenticated" | "anonymous";
  user: {
    address: string;
    createdAt: string;
    lastLoginAt: string;
    referralCode: string;
    referredUsersCount: number;
  } | null;
};

const authMock = {
  beginSignIn: vi.fn(),
  refreshSession: vi.fn(),
  signOut: vi.fn(),
  state: {
    isAuthenticated: true,
    status: "authenticated",
    user: {
      address: "0x7a3b9f2c11111111111111111111111111111111",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      referralCode: "GRAVII",
      referredUsersCount: 0,
    },
  } as MockAuthState,
};

vi.mock("@/features/auth/auth-provider", () => {
  return {
    useUserAuth: () => ({
      beginSignIn: authMock.beginSignIn,
      isAuthenticated: authMock.state.isAuthenticated,
      refreshSession: authMock.refreshSession,
      signOut: authMock.signOut,
      status: authMock.state.status,
      user: authMock.state.user,
    }),
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    authMock.beginSignIn.mockReset();
    authMock.refreshSession.mockReset();
    authMock.signOut.mockReset();
    authMock.state = {
      isAuthenticated: true,
      status: "authenticated",
      user: {
        address: "0x7a3b9f2c11111111111111111111111111111111",
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        referralCode: "GRAVII",
        referredUsersCount: 0,
      },
    };
  });

  it("calls sign out from the session button", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const authButton = screen.getByRole("button", { name: "SIGN OUT" });

    await user.click(authButton);

    expect(authMock.signOut).toHaveBeenCalledTimes(1);
  });

  it("keeps the launch app visible for anonymous users and starts sign-in from the header", async () => {
    const user = userEvent.setup();
    authMock.state = {
      isAuthenticated: false,
      status: "anonymous",
      user: null,
    };

    render(<HomePage />);

    const authButton = screen.getByRole("button", { name: "SIGN IN" });

    await user.click(authButton);

    expect(authMock.beginSignIn).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "GRAVII ID panel" })).toBeInTheDocument();
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
