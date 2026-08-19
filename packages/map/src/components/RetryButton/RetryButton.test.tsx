import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RetryButton } from "./RetryButton";

describe("RetryButton", () => {
  it("renders 'Retry' by default and calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<RetryButton onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a custom label when given", () => {
    render(<RetryButton label="Try again" onClick={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });

  it("appends a caller-supplied className to its own button class", () => {
    render(
      <RetryButton onClick={vi.fn()} className="caller-class" label="Retry" />,
    );

    expect(screen.getByRole("button", { name: "Retry" }).className).toMatch(
      /\bcaller-class\b/,
    );
  });

  it("passes through data attributes and disabled state", () => {
    render(
      <RetryButton
        onClick={vi.fn()}
        disabled
        data-testid="my-retry"
        data-e2e="my-retry"
      />,
    );

    const button = screen.getByTestId("my-retry");
    expect(button).toHaveAttribute("data-e2e", "my-retry");
    expect(button).toBeDisabled();
  });
});
