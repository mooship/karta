import type { DomainConfig } from "@karta/core";
import { setThemePreference } from "@karta/react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DomainProvider } from "../../context/DomainContext";
import { TEST_DOMAIN } from "../../testFixtures/domain";
import { Legend } from "./Legend";

function withDomain(ui: React.ReactElement) {
  return <DomainProvider domain={TEST_DOMAIN}>{ui}</DomainProvider>;
}

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("Legend", () => {
  afterEach(() => {
    setThemePreference("system");
    vi.unstubAllGlobals();
  });

  it("renders each choropleth layer's bucket labels and colors from its style config", () => {
    render(withDomain(<Legend />));
    expect(
      screen.getByRole("list", { name: /Coverage level/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("list", { name: /Alternate coverage/i }),
    ).toBeInTheDocument();
  });

  it("shows a bucket's color swatch in light theme, ignoring darkColor", () => {
    stubMatchMedia(false);
    render(withDomain(<Legend />));

    expect(screen.getByText("Low").previousElementSibling).toHaveStyle({
      backgroundColor: "#7A9B6E",
    });
  });

  it("shows a bucket's darkColor swatch instead of color when dark theme is active", () => {
    stubMatchMedia(true);
    render(withDomain(<Legend />));

    expect(screen.getByText("Low").previousElementSibling).toHaveStyle({
      backgroundColor: "#274A66",
    });
  });

  it("falls back to a bucket's color in dark theme when darkColor is unset", () => {
    stubMatchMedia(true);
    render(withDomain(<Legend />));

    expect(screen.getByText("High").previousElementSibling).toHaveStyle({
      backgroundColor: "#D6703F",
    });
  });

  it("shows a No data swatch for every choropleth layer", () => {
    stubMatchMedia(false);
    render(withDomain(<Legend />));
    expect(screen.getAllByText("No data")).toHaveLength(2);
    for (const entry of screen.getAllByText("No data")) {
      expect(entry.previousElementSibling).toHaveStyle({
        backgroundColor: "#8A93A5",
      });
    }
  });

  it("shows the dark No data swatch colour when dark theme is active", () => {
    stubMatchMedia(true);
    render(withDomain(<Legend />));
    for (const entry of screen.getAllByText("No data")) {
      expect(entry.previousElementSibling).toHaveStyle({
        backgroundColor: "#5b6476",
      });
    }
  });

  it("renders one transit entry per line layer with label and color", () => {
    render(withDomain(<Legend />));
    expect(screen.getByText("Rail")).toBeInTheDocument();
    expect(screen.getByText("Rail").closest("li")).toHaveTextContent(
      "line + stations",
    );
    expect(screen.getByText("Bus").closest("li")).toHaveTextContent(
      "route only",
    );
  });

  it("marks rail and shuttle as line + stations via hasPointGeometry", () => {
    render(withDomain(<Legend />));
    expect(screen.getByText("Shuttle").closest("li")).toHaveTextContent(
      "line + stations",
    );
    expect(screen.getByText("North Line").closest("li")).toHaveTextContent(
      "route only",
    );
  });

  it("renders one entry per operator for a line layer with a categorized color classification", () => {
    render(withDomain(<Legend />));
    expect(screen.getByText("North Line")).toBeInTheDocument();
    expect(screen.getByText("South Line")).toBeInTheDocument();
    expect(screen.getByText("East Line")).toBeInTheDocument();
    expect(screen.queryByText("Bus Network")).not.toBeInTheDocument();
  });

  it("renders one entry per stop for a line layer with a graduated color classification", () => {
    const graduatedDomain: DomainConfig = {
      layers: [
        {
          id: "traffic",
          label: "Traffic",
          dataSource: ["/data/example/traffic.geojson"],
          geometryKind: "line",
          defaultVisible: true,
          available: true,
          style: {
            kind: "line",
            color: "#8A93A5",
            weight: 2,
            legendLabel: "Traffic",
            colorClassification: {
              kind: "graduated",
              propertyKey: "volume",
              stops: [
                { max: 100, value: "#7A9B6E", label: "Light" },
                { max: 500, value: "#D6703F", label: "Heavy" },
              ],
              fallback: "#8A93A5",
            },
          },
        },
      ],
      layerGroups: [],
    };

    render(
      <DomainProvider domain={graduatedDomain}>
        <Legend />
      </DomainProvider>,
    );

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Heavy")).toBeInTheDocument();
    expect(screen.queryByText("Traffic")).not.toBeInTheDocument();
  });

  it("in active mode, shows only visible layer sections", () => {
    render(withDomain(<Legend mode="active" visibleLayerIds={["areas"]} />));
    expect(
      screen.getByRole("list", { name: /Active map layers legend/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Rail")).not.toBeInTheDocument();
  });

  it("shows empty-state message when no layers are active", () => {
    render(withDomain(<Legend mode="active" visibleLayerIds={[]} />));
    expect(
      screen.getByText("Turn on layers to view their legend."),
    ).toBeInTheDocument();
  });
});
