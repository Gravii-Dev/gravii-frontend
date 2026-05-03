import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationMock = {
  pathname: "/",
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
};

const userApiMock = {
  clearUserToken: vi.fn(),
  readUserSession: vi.fn(async () => null),
};

vi.doMock("next/navigation", () => ({
  usePathname: () => navigationMock.pathname,
  useRouter: () => ({
    push: navigationMock.push,
    refresh: navigationMock.refresh,
    replace: navigationMock.replace,
  }),
  useSearchParams: () => navigationMock.searchParams,
}));

vi.doMock("@/lib/auth/user-api", () => ({
  clearUserToken: userApiMock.clearUserToken,
  readUserSession: userApiMock.readUserSession,
}));

async function renderAuthProvider() {
  const { UserAuthProvider, useUserAuth } = await import("./auth-provider");

  function AuthStateProbe() {
    const auth = useUserAuth();

    return (
      <div>
        <span data-testid="auth-status">{auth.status}</span>
        <button onClick={auth.beginSignIn} type="button">
          Begin sign in
        </button>
        <button onClick={() => void auth.signOut()} type="button">
          Sign out
        </button>
      </div>
    );
  }

  render(
    <UserAuthProvider>
      <AuthStateProbe />
    </UserAuthProvider>
  );
}

describe("UserAuthProvider", () => {
  beforeEach(() => {
    navigationMock.pathname = "/";
    navigationMock.searchParams = new URLSearchParams();
    navigationMock.push.mockReset();
    navigationMock.refresh.mockReset();
    navigationMock.replace.mockReset();
    userApiMock.clearUserToken.mockReset();
    userApiMock.readUserSession.mockReset();
    userApiMock.readUserSession.mockResolvedValue(null);
  });

  it("keeps anonymous users on the launch app instead of redirecting to sign-in", async () => {
    await renderAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("anonymous");
    });

    expect(navigationMock.replace).not.toHaveBeenCalled();
  });

  it("routes to sign-in only when the user explicitly begins sign-in", async () => {
    const user = userEvent.setup();
    navigationMock.pathname = "/";
    navigationMock.searchParams = new URLSearchParams("panel=lookup");

    await renderAuthProvider();

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent("anonymous");
    });

    await user.click(screen.getByRole("button", { name: "Begin sign in" }));

    expect(navigationMock.push).toHaveBeenCalledWith(
      "/sign-in?next=%2F%3Fpanel%3Dlookup"
    );
  });

  it("returns to the launch app after sign-out instead of opening sign-in", async () => {
    const user = userEvent.setup();

    await renderAuthProvider();

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    expect(userApiMock.clearUserToken).toHaveBeenCalledTimes(1);
    expect(navigationMock.replace).toHaveBeenCalledWith("/");
  });
});
