import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { getLocale } = vi.hoisted(() => ({
  getLocale: vi.fn(() => "en"),
}));

vi.mock("../../paraglide/runtime.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../paraglide/runtime.js")>();
  return { ...actual, getLocale };
});

import { DomainSwitcher } from "./DomainSwitcher";

describe("DomainSwitcher", () => {
  it("renders one real link per registered domain, pointing at its /d/<id> route", () => {
    render(<DomainSwitcher activeDomainId="gauteng-spatial-legacy" />);

    const legacyLink = screen.getByRole("link", { name: "Spatial legacy" });
    expect(legacyLink).toHaveAttribute("href", "/d/gauteng-spatial-legacy");

    const heritageLink = screen.getByRole("link", { name: "Heritage sites" });
    expect(heritageLink).toHaveAttribute("href", "/d/heritage-sites");
  });

  it("marks the active domain's link with aria-current, and no other", () => {
    render(<DomainSwitcher activeDomainId="heritage-sites" />);

    expect(
      screen.getByRole("link", { name: "Heritage sites" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "Spatial legacy" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("labels the nav for assistive technology", () => {
    render(<DomainSwitcher activeDomainId="gauteng-spatial-legacy" />);

    expect(
      screen.getByRole("navigation", { name: "Choose a map" }),
    ).toBeInTheDocument();
  });

  it("shows a localized label for a known domain, translated to the current locale", () => {
    getLocale.mockReturnValue("zu");

    render(<DomainSwitcher activeDomainId="heritage-sites" />);

    expect(
      screen.getByRole("link", { name: "Izindawo zefa" }),
    ).toBeInTheDocument();

    getLocale.mockReturnValue("en");
  });
});
