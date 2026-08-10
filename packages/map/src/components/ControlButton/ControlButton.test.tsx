import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ControlButton } from "./ControlButton";

/**
 * happy-dom doesn't render `@material/web` custom elements' shadow DOM
 * (see packages/map/vitest.setup.ts), so `getByRole` can't compute an
 * accessible name/role the way a real browser would — these assertions
 * check the underlying `md-*` element and its reflected attributes/
 * properties directly instead. Real accessible-name/role behaviour is
 * covered in Playwright e2e. Each test also `waitFor`s the element to
 * appear, since `ControlButton` renders a plain `<button>` fallback (see
 * `ControlButton.tsx`) until its `React.lazy()`-loaded Material
 * implementation resolves.
 */
describe("ControlButton", () => {
  it("renders a filled-tonal pill button using visible text as its label", async () => {
    const { container } = render(
      <ControlButton shape="pill">Explore</ControlButton>,
    );

    const button = await waitFor(() => {
      const element = container.querySelector("md-filled-tonal-button");
      expect(element).not.toBeNull();
      return element as HTMLElement & { type?: string };
    });
    expect(button).toHaveAttribute("data-shape", "pill");
    expect(button.type).toBe("button");
    expect(button).toHaveTextContent("Explore");
    expect(button.getAttribute("aria-label")).toBeFalsy();
  });

  it("uses the explicit label for icon-only buttons", async () => {
    const { container } = render(
      <ControlButton label="Open settings">
        <span aria-hidden="true">S</span>
      </ControlButton>,
    );

    const button = await waitFor(() => {
      const element = container.querySelector("md-filled-tonal-icon-button");
      expect(element).not.toBeNull();
      return element as HTMLElement;
    });
    expect(button).toHaveAttribute("data-shape", "icon");
    expect(button.getAttribute("aria-label")).toBe("Open settings");
  });

  it("supports embedded variant semantics", async () => {
    const { container } = render(
      <ControlButton variant="embedded" label="Close panel">
        <span aria-hidden="true">X</span>
      </ControlButton>,
    );

    const button = await waitFor(() => {
      const element = container.querySelector("md-icon-button");
      expect(element).not.toBeNull();
      return element as HTMLElement;
    });
    expect(button).toHaveAttribute("data-variant", "embedded");
    expect(button.getAttribute("aria-label")).toBe("Close panel");
  });
});
