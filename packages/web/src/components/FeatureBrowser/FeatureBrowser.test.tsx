import type { SelectableFeatureSearchEntry } from "@karta/map";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as registry from "../../layers/registry";
import { FeatureBrowser } from "./FeatureBrowser";

const TOWNSHIP_FEATURES: SelectableFeatureSearchEntry[] = [
  { id: "A", label: "Mamelodi", layerId: "townships" },
  { id: "B", label: "Soshanguve", layerId: "townships" },
];

const RAIL_FEATURES: SelectableFeatureSearchEntry[] = [
  { id: "R1", label: "Hatfield Station", layerId: "rapid-rail" },
];

describe("FeatureBrowser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("groups features under a heading naming their layer", () => {
    render(
      <FeatureBrowser
        features={[...TOWNSHIP_FEATURES, ...RAIL_FEATURES]}
        selectedFeatureId={null}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Modelled car time" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Rapid Rail" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Mamelodi")).toBeInTheDocument();
    expect(screen.getByText("Soshanguve")).toBeInTheDocument();
    expect(screen.getByText("Hatfield Station")).toBeInTheDocument();
  });

  it("orders layer groups to match the domain registry's own layer order", () => {
    render(
      <FeatureBrowser
        features={[...RAIL_FEATURES, ...TOWNSHIP_FEATURES]}
        selectedFeatureId={null}
        onSelect={vi.fn()}
      />,
    );

    const headings = screen.getAllByRole("heading").map((el) => el.textContent);
    expect(headings.indexOf("Modelled car time")).toBeLessThan(
      headings.indexOf("Rapid Rail"),
    );
  });

  it("calls onSelect with a feature's id when its row is clicked", () => {
    const onSelect = vi.fn();
    render(
      <FeatureBrowser
        features={TOWNSHIP_FEATURES}
        selectedFeatureId={null}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByTestId("feature-browser-item-A"));

    expect(onSelect).toHaveBeenCalledWith("A");
  });

  it("marks the currently selected feature's row as current", () => {
    render(
      <FeatureBrowser
        features={TOWNSHIP_FEATURES}
        selectedFeatureId="B"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByTestId("feature-browser-item-A")).toHaveAttribute(
      "aria-current",
      "false",
    );
    expect(screen.getByTestId("feature-browser-item-B")).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("filters rows by a case-insensitive substring match on label", () => {
    render(
      <FeatureBrowser
        features={TOWNSHIP_FEATURES}
        selectedFeatureId={null}
        onSelect={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId("feature-browser-filter"), {
      target: { value: "sosh" },
    });

    expect(screen.queryByText("Mamelodi")).not.toBeInTheDocument();
    expect(screen.getByText("Soshanguve")).toBeInTheDocument();
  });

  it("shows an empty-state message when nothing matches the filter", () => {
    render(
      <FeatureBrowser
        features={TOWNSHIP_FEATURES}
        selectedFeatureId={null}
        onSelect={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByTestId("feature-browser-filter"), {
      target: { value: "nothing matches this" },
    });

    expect(
      screen.getByText("Nothing matched that search."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("falls back to the raw layer id as a heading when the layer isn't in the registry", () => {
    vi.spyOn(registry, "getLayer").mockReturnValue(undefined);

    render(
      <FeatureBrowser
        features={[{ id: "Z", label: "Ghost", layerId: "unknown-layer" }]}
        selectedFeatureId={null}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "unknown-layer" }),
    ).toBeInTheDocument();
  });
});
