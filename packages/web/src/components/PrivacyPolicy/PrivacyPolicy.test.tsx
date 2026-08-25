import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrivacyPolicy } from "./PrivacyPolicy";

describe("PrivacyPolicy", () => {
  it("renders the page heading", () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByRole("heading", { name: "Privacy policy", level: 1 }),
    ).toBeInTheDocument();
  });

  it("discloses the locale cookie by name, correcting the old 'no cookies' claim", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByText(/PARAGLIDE_LOCALE/)).toBeInTheDocument();
  });

  it("discloses the theme preference stored in localStorage", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByText(/localStorage/)).toBeInTheDocument();
  });

  it("discloses Cloudflare Web Analytics as cookieless and aggregate-only", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByText(/Cloudflare Web Analytics/)).toBeInTheDocument();
    expect(screen.getByText(/cookieless/)).toBeInTheDocument();
  });

  it("discloses the basemap tile and location-search third parties", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByText(/OpenStreetMap/)).toBeInTheDocument();
    expect(screen.getByText(/CARTO/)).toBeInTheDocument();
    expect(screen.getByText(/Nominatim/)).toBeInTheDocument();
  });

  it("states that the geolocation API is not used", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByText(/geolocation/i)).toBeInTheDocument();
  });

  it("discloses client-side error reports as containing no personal data", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByText(/diagnostic report/)).toBeInTheDocument();
    expect(
      screen.getByText(/Cloudflare's operational logs/),
    ).toBeInTheDocument();
  });
});
