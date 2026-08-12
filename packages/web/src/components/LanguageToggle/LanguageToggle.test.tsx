import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { getLocale, setLocale } = vi.hoisted(() => ({
  getLocale: vi.fn(() => "en"),
  setLocale: vi.fn(),
}));

vi.mock("../../paraglide/runtime.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../paraglide/runtime.js")>();
  return { ...actual, getLocale, setLocale };
});

import { LanguageToggle } from "./LanguageToggle";

describe("LanguageToggle", () => {
  it("marks the current locale as pressed", () => {
    getLocale.mockReturnValue("st");
    render(<LanguageToggle />);

    expect(screen.getByTestId("language-option-st")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("language-option-en")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByTestId("language-option-zu")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByTestId("language-option-xh")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByTestId("language-option-af")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows every configured locale by its own autonym", () => {
    getLocale.mockReturnValue("en");
    render(<LanguageToggle />);

    expect(screen.getByTestId("language-option-en")).toHaveTextContent(
      "English",
    );
    expect(screen.getByTestId("language-option-st")).toHaveTextContent(
      "Sesotho",
    );
    expect(screen.getByTestId("language-option-zu")).toHaveTextContent(
      "isiZulu",
    );
    expect(screen.getByTestId("language-option-xh")).toHaveTextContent(
      "isiXhosa",
    );
    expect(screen.getByTestId("language-option-af")).toHaveTextContent(
      "Afrikaans",
    );
  });

  it("calls setLocale with the picked locale", () => {
    getLocale.mockReturnValue("en");
    render(<LanguageToggle />);

    fireEvent.click(screen.getByTestId("language-option-zu"));

    expect(setLocale).toHaveBeenCalledWith("zu");
  });
});
