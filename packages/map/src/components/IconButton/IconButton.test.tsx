import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "./IconButton";

/**
 * See ControlButton.test.tsx for why these query the underlying `md-*`
 * element directly (rather than by ARIA role) and `waitFor` it to appear
 * (rather than assert synchronously) — `ControlButton`'s Material
 * implementation loads via `React.lazy()`.
 */
describe("IconButton", () => {
  it("uses icon shape and explicit accessible label", async () => {
    const { container } = render(
      <IconButton label="Open map legend">
        <span aria-hidden="true">L</span>
      </IconButton>,
    );

    const button = await waitFor(() => {
      const element = container.querySelector("md-filled-tonal-icon-button");
      expect(element).not.toBeNull();
      return element as HTMLElement;
    });
    expect(button).toHaveAttribute("data-shape", "icon");
    expect(button.getAttribute("aria-label")).toBe("Open map legend");
  });

  it("passes variant through to the shared control button", async () => {
    const { container } = render(
      <IconButton label="Close" variant="embedded">
        <span aria-hidden="true">X</span>
      </IconButton>,
    );

    const button = await waitFor(() => {
      const element = container.querySelector("md-icon-button");
      expect(element).not.toBeNull();
      return element as HTMLElement;
    });
    expect(button).toHaveAttribute("data-variant", "embedded");
    expect(button.getAttribute("aria-label")).toBe("Close");
  });
});
