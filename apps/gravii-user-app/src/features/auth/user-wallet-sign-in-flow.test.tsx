import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserWalletSignInFlow } from "./user-wallet-sign-in-flow";

const { reownMock, userApiMock, wagmiMock } = vi.hoisted(() => ({
  reownMock: {
    open: vi.fn(async () => undefined),
    state: {
      initialized: true,
      loading: false,
    },
  },
  userApiMock: {
    clearUserIdentityBootstrapPending: vi.fn(),
    markUserIdentityBootstrapPending: vi.fn(),
    requestUserChallenge: vi.fn(async () => ({
      message: "Sign in to Gravii",
    })),
    verifyUserWallet: vi.fn(async () => ({
      status: "existing" as const,
    })),
  },
  wagmiMock: {
    connection: {
      address: undefined as `0x${string}` | undefined,
      isConnected: false,
    },
    signMessageAsync: vi.fn(async () => "0xsigned"),
  },
}));

vi.mock("@reown/appkit/react", () => ({
  useAppKit: () => ({
    open: reownMock.open,
  }),
  useAppKitState: () => reownMock.state,
}));

vi.mock("wagmi", () => ({
  useConnection: () => wagmiMock.connection,
  useSignMessage: () => ({
    signMessageAsync: wagmiMock.signMessageAsync,
  }),
}));

vi.mock("@/lib/auth/user-api", () => userApiMock);

vi.mock("@/lib/wallet/appkit-config", () => ({
  isWalletConnectConfigured: true,
}));

describe("UserWalletSignInFlow", () => {
  beforeEach(() => {
    reownMock.open.mockClear();
    reownMock.state = {
      initialized: true,
      loading: false,
    };
    wagmiMock.connection = {
      address: undefined,
      isConnected: false,
    };
    wagmiMock.signMessageAsync.mockClear();
    userApiMock.clearUserIdentityBootstrapPending.mockClear();
    userApiMock.markUserIdentityBootstrapPending.mockClear();
    userApiMock.requestUserChallenge.mockClear();
    userApiMock.verifyUserWallet.mockClear();
  });

  it("authenticates the existing wallet instead of forcing a disconnect after app sign-out", async () => {
    const onAuthenticated = vi.fn(async () => undefined);
    wagmiMock.connection = {
      address: "0x7a3b9f2c11111111111111111111111111111111",
      isConnected: true,
    };

    render(
      <UserWalletSignInFlow
        autoStart
        nextPath="/"
        onAuthenticated={onAuthenticated}
        referralCode={null}
        variant="launcher"
      />,
    );

    await waitFor(() => {
      expect(userApiMock.verifyUserWallet).toHaveBeenCalledWith({
        address: "0x7a3b9f2c11111111111111111111111111111111",
        message: "Sign in to Gravii",
        signature: "0xsigned",
      });
    });

    expect(reownMock.open).not.toHaveBeenCalled();
    expect(onAuthenticated).toHaveBeenCalledTimes(1);
  });
});
