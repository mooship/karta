import type { TownshipProperties } from "@karta/app";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { getLocale } = vi.hoisted(() => ({
  getLocale: vi.fn(() => "en"),
}));

vi.mock("../../paraglide/runtime.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../paraglide/runtime.js")>();
  return { ...actual, getLocale };
});

import { TownshipPopup } from "./TownshipPopup";

const properties: TownshipProperties = {
  id: "A",
  name: "Mamelodi SP",
  population: 334577,
  commuteMinutes: 62,
  nearestJobCenter: "Pretoria CBD",
  distanceKm: 28.4,
  nearestTransitKm: null,
  nearestAReYengStopKm: null,
};

describe("TownshipPopup", () => {
  afterEach(() => {
    getLocale.mockReturnValue("en");
  });

  it("shows name, population, modelled car time, and nearest job center", () => {
    render(<TownshipPopup properties={properties} />);

    expect(screen.getByText("Mamelodi SP")).toBeInTheDocument();
    expect(screen.getByText(/334[\s,]577/)).toBeInTheDocument();
    expect(screen.getByText("1h 2min")).toBeInTheDocument();
    expect(screen.getByText("Modelled car time")).toBeInTheDocument();
    expect(screen.getByText("Pretoria CBD")).toBeInTheDocument();
  });

  it("omits rows for values that have no data instead of inventing them", () => {
    render(
      <TownshipPopup
        properties={{ ...properties, population: undefined, distanceKm: null }}
      />,
    );

    expect(screen.queryByText(/population/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/distance/i)).not.toBeInTheDocument();
  });

  it("shows 'No data' when the modelled car time is unknown", () => {
    render(
      <TownshipPopup properties={{ ...properties, commuteMinutes: null }} />,
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("shows the distance to nearest transit when it is known", () => {
    render(
      <TownshipPopup properties={{ ...properties, nearestTransitKm: 4.28 }} />,
    );

    expect(screen.getByText("Distance to nearest transit")).toBeInTheDocument();
    expect(screen.getByText("4.3 km")).toBeInTheDocument();
  });

  it("formats population using the active locale's number grouping, not a fixed one", () => {
    getLocale.mockReturnValue("af");
    render(<TownshipPopup properties={properties} />);

    expect(screen.getByText("334 577")).toBeInTheDocument();
  });

  it("formats distance figures using the active locale's decimal separator, not a fixed one", () => {
    getLocale.mockReturnValue("af");
    render(
      <TownshipPopup properties={{ ...properties, nearestTransitKm: 4.28 }} />,
    );

    expect(screen.getByText("28,4 km")).toBeInTheDocument();
    expect(screen.getByText("4,3 km")).toBeInTheDocument();
  });
});
