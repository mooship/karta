import type { Layer, LayerGroup } from "@karta/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as registry from "../../layers/registry";
import { LayerToggles } from "./LayerToggles";

const coreMocks = vi.hoisted(() => ({
  fetchFeatureCollection: vi.fn(),
  featureCollectionToCsv: vi.fn(),
}));

vi.mock("@karta/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@karta/core")>();
  return {
    ...actual,
    fetchFeatureCollection: coreMocks.fetchFeatureCollection,
    featureCollectionToCsv: coreMocks.featureCollectionToCsv,
  };
});

describe("LayerToggles", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("marks an unavailable layer as unavailable and disabled, with a badge", () => {
    const unavailableLayer: Layer = {
      id: "myciti",
      label: "MyCiTi",
      dataSource: ["/data/myciti.geojson"],
      geometryKind: "line",
      defaultVisible: false,
      available: false,
      style: { kind: "line", color: "#000", weight: 2 },
    };
    const group: LayerGroup = {
      id: "transit",
      title: "Transit",
      layerIds: ["myciti"],
    };
    vi.spyOn(registry, "getLayer").mockReturnValue(unavailableLayer);
    vi.spyOn(registry, "getLayerGroups").mockReturnValue([group]);

    render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);

    expect(screen.getByTestId("layer-toggle-myciti-row")).toHaveAttribute(
      "data-unavailable",
      "true",
    );
    expect(screen.getByTestId("layer-toggle-myciti")).toBeDisabled();
    expect(screen.getByText("Not yet available")).toBeInTheDocument();
  });

  it("reflects visibility state on each layer's checkbox", () => {
    render(<LayerToggles visibleLayerIds={["townships"]} onToggle={vi.fn()} />);

    expect(screen.getByTestId("layer-toggle-townships")).toBeChecked();
    expect(screen.getByTestId("layer-toggle-rapid-rail")).not.toBeChecked();
  });

  it("calls onToggle with the layer id when its checkbox is clicked", () => {
    const onToggle = vi.fn();
    render(<LayerToggles visibleLayerIds={[]} onToggle={onToggle} />);

    screen.getByTestId("layer-toggle-rapid-rail").click();

    expect(onToggle).toHaveBeenCalledWith("rapid-rail");
  });

  it("shows a layer's description when it has one", () => {
    const layerWithDescription: Layer = {
      id: "townships",
      label: "Modelled car time",
      description:
        "Modelled car drive-time from each recognised township area to its nearest selected job centre.",
      dataSource: ["/data/townships.geojson"],
      geometryKind: "choropleth",
      defaultVisible: true,
      available: true,
      style: {
        kind: "choropleth",
        propertyKey: "commuteMinutes",
        buckets: [],
        baseOpacity: 0.2,
      },
    };
    const group: LayerGroup = {
      id: "access-to-opportunity",
      title: "Accessibility overlays",
      selectionMode: "exclusive",
      layerIds: ["townships"],
    };
    vi.spyOn(registry, "getLayer").mockReturnValue(layerWithDescription);
    vi.spyOn(registry, "getLayerGroups").mockReturnValue([group]);

    render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);

    expect(
      screen.getByTestId("layer-toggle-townships-description"),
    ).toHaveTextContent(
      "Modelled car drive-time from each recognised township area to its nearest selected job centre.",
    );
  });

  it("shows no description for a layer that doesn't have one", () => {
    const layerWithoutDescription: Layer = {
      id: "myciti",
      label: "MyCiTi",
      dataSource: ["/data/myciti.geojson"],
      geometryKind: "line",
      defaultVisible: false,
      available: true,
      style: { kind: "line", color: "#000", weight: 2 },
    };
    const group: LayerGroup = {
      id: "transit",
      title: "Transit",
      selectionMode: "independent",
      layerIds: ["myciti"],
    };
    vi.spyOn(registry, "getLayer").mockReturnValue(layerWithoutDescription);
    vi.spyOn(registry, "getLayerGroups").mockReturnValue([group]);

    render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);

    expect(
      screen.queryByTestId("layer-toggle-myciti-description"),
    ).not.toBeInTheDocument();
  });

  it("shows no failure badge by default", () => {
    render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);

    expect(
      screen.queryByTestId("layer-toggle-rapid-rail-error"),
    ).not.toBeInTheDocument();
  });

  it("shows a failure badge for a layer whose data failed to load", () => {
    render(
      <LayerToggles
        visibleLayerIds={["rapid-rail"]}
        onToggle={vi.fn()}
        failedLayerIds={["rapid-rail"]}
      />,
    );

    expect(
      screen.getByTestId("layer-toggle-rapid-rail-error"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("layer-toggle-bus-error"),
    ).not.toBeInTheDocument();
  });

  it("links to an available layer's data source as a GeoJSON download", () => {
    render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);

    const download = screen.getByRole("link", {
      name: /download rapid rail data/i,
    });
    expect(download).toHaveAttribute(
      "href",
      "/data/gauteng/rapid-rail.display.v1.geojson",
    );
    expect(download).toHaveAttribute("download", "rapid-rail.geojson");
  });

  it("renders one download link per data source when a layer has more than one", () => {
    const multiSourceLayer: Layer = {
      id: "combined",
      label: "Combined",
      dataSource: ["/data/a.geojson", "/data/b.geojson"],
      geometryKind: "line",
      defaultVisible: false,
      available: true,
      style: { kind: "line", color: "#000", weight: 2 },
    };
    const group: LayerGroup = {
      id: "transit",
      title: "Transit",
      selectionMode: "independent",
      layerIds: ["combined"],
    };
    vi.spyOn(registry, "getLayer").mockReturnValue(multiSourceLayer);
    vi.spyOn(registry, "getLayerGroups").mockReturnValue([group]);

    render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);

    const downloads = screen.getAllByRole("link", {
      name: /download combined data/i,
    });
    expect(downloads).toHaveLength(2);
    expect(downloads[0]).toHaveAttribute("href", "/data/a.geojson");
    expect(downloads[0]).toHaveAttribute("download", "combined-1.geojson");
    expect(downloads[1]).toHaveAttribute("href", "/data/b.geojson");
    expect(downloads[1]).toHaveAttribute("download", "combined-2.geojson");
  });

  it("shows no download link for an unavailable layer", () => {
    const unavailableLayer: Layer = {
      id: "myciti",
      label: "MyCiTi",
      dataSource: ["/data/myciti.geojson"],
      geometryKind: "line",
      defaultVisible: false,
      available: false,
      style: { kind: "line", color: "#000", weight: 2 },
    };
    const group: LayerGroup = {
      id: "transit",
      title: "Transit",
      layerIds: ["myciti"],
    };
    vi.spyOn(registry, "getLayer").mockReturnValue(unavailableLayer);
    vi.spyOn(registry, "getLayerGroups").mockReturnValue([group]);

    render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);

    expect(
      screen.queryByRole("link", { name: /download/i }),
    ).not.toBeInTheDocument();
  });

  it("doesn't toggle the layer when its download link is clicked", () => {
    const onToggle = vi.fn();
    render(<LayerToggles visibleLayerIds={[]} onToggle={onToggle} />);

    fireEvent.click(
      screen.getByRole("link", { name: /download rapid rail data/i }),
    );

    expect(onToggle).not.toHaveBeenCalled();
  });

  describe("CSV export", () => {
    afterEach(() => {
      coreMocks.fetchFeatureCollection.mockReset();
      coreMocks.featureCollectionToCsv.mockReset();
    });

    it("shows a CSV download button alongside the GeoJSON download link", () => {
      render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);

      expect(
        screen.getByRole("button", {
          name: /download rapid rail data \(csv\)/i,
        }),
      ).toBeInTheDocument();
    });

    it("fetches the layer's data, converts it to CSV, and triggers a download when clicked", async () => {
      const collection = { type: "FeatureCollection", features: [] } as const;
      coreMocks.fetchFeatureCollection.mockResolvedValue(collection);
      coreMocks.featureCollectionToCsv.mockReturnValue("name\nAlexandra");
      const createObjectUrlSpy = vi
        .spyOn(URL, "createObjectURL")
        .mockReturnValue("blob:mock-url");
      const revokeObjectUrlSpy = vi
        .spyOn(URL, "revokeObjectURL")
        .mockImplementation(() => {});
      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});

      render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);
      fireEvent.click(
        screen.getByRole("button", {
          name: /download rapid rail data \(csv\)/i,
        }),
      );

      await waitFor(() => {
        expect(clickSpy).toHaveBeenCalled();
      });
      expect(coreMocks.fetchFeatureCollection).toHaveBeenCalledWith(
        "/data/gauteng/rapid-rail.display.v1.geojson",
      );
      expect(coreMocks.featureCollectionToCsv).toHaveBeenCalledWith(collection);
      expect(createObjectUrlSpy).toHaveBeenCalled();
      expect(revokeObjectUrlSpy).toHaveBeenCalledWith("blob:mock-url");

      createObjectUrlSpy.mockRestore();
      revokeObjectUrlSpy.mockRestore();
      clickSpy.mockRestore();
    });

    it("shows an inline error and doesn't download anything if the CSV export fails", async () => {
      coreMocks.fetchFeatureCollection.mockRejectedValue(new Error("network"));
      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});

      render(<LayerToggles visibleLayerIds={[]} onToggle={vi.fn()} />);
      fireEvent.click(
        screen.getByRole("button", {
          name: /download rapid rail data \(csv\)/i,
        }),
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("layer-toggle-rapid-rail-csv-error"),
        ).toBeInTheDocument();
      });
      expect(clickSpy).not.toHaveBeenCalled();

      clickSpy.mockRestore();
    });

    it("doesn't toggle the layer when the CSV button is clicked", () => {
      const onToggle = vi.fn();
      coreMocks.fetchFeatureCollection.mockReturnValue(new Promise(() => {}));

      render(<LayerToggles visibleLayerIds={[]} onToggle={onToggle} />);
      fireEvent.click(
        screen.getByRole("button", {
          name: /download rapid rail data \(csv\)/i,
        }),
      );

      expect(onToggle).not.toHaveBeenCalled();
    });
  });
});
