import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HomePage from "./page";

describe("HomePage", () => {
  it("toggles the session button label", async () => {
    const user = userEvent.setup();

    render(<HomePage />);

    const authButton = screen.getByRole("button", { name: "SIGN IN" });

    await user.click(authButton);

    expect(screen.getByRole("button", { name: "SIGN OUT" })).toBeInTheDocument();
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
