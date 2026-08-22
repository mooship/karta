import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { DomainProvider } from "../../context/DomainContext";
import { TEST_DOMAIN } from "../../testFixtures/domain";
import type { SelectableFeatureSearchEntry } from "../LocationSearchControl/LocationSearchControl";
import { FeatureBrowser } from "./FeatureBrowser";

const AREA_FEATURES: SelectableFeatureSearchEntry[] = [
  { id: "A", label: "Mamelodi", layerId: "areas" },
  { id: "B", label: "Soshanguve", layerId: "areas" },
];

const RAIL_FEATURES: SelectableFeatureSearchEntry[] = [
  { id: "R1", label: "Hatfield Station", layerId: "rail" },
];

function withDomain(ui: ReactNode) {
  return <DomainProvider domain={TEST_DOMAIN}>{ui}</DomainProvider>;
}

describe("FeatureBrowser", () => {
  it("groups features under a heading naming their layer", () => {
    render(
      withDomain(
        <FeatureBrowser
          features={[...AREA_FEATURES, ...RAIL_FEATURES]}
          selectedFeatureId={null}
          onSelect={vi.fn()}
        />,
      ),
    );

    expect(
      screen.getByRole("heading", { name: "Coverage level" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Rail" })).toBeInTheDocument();
    expect(screen.getByText("Mamelodi")).toBeInTheDocument();
    expect(screen.getByText("Soshanguve")).toBeInTheDocument();
    expect(screen.getByText("Hatfield Station")).toBeInTheDocument();
  });

  it("orders layer groups to match the domain registry's own layer order", () => {
    render(
      withDomain(
        <FeatureBrowser
          features={[...RAIL_FEATURES, ...AREA_FEATURES]}
          selectedFeatureId={null}
          onSelect={vi.fn()}
        />,
      ),
    );

    const headings = screen.getAllByRole("heading").map((el) => el.textContent);
    expect(headings.indexOf("Coverage level")).toBeLessThan(
      headings.indexOf("Rail"),
    );
  });

  it("calls onSelect with a feature's id when its row is clicked", () => {
    const onSelect = vi.fn();
    render(
      withDomain(
        <FeatureBrowser
          features={AREA_FEATURES}
          selectedFeatureId={null}
          onSelect={onSelect}
        />,
      ),
    );

    fireEvent.click(screen.getByTestId("feature-browser-item-A"));

    expect(onSelect).toHaveBeenCalledWith("A");
  });

  it("marks the currently selected feature's row as current", () => {
    render(
      withDomain(
        <FeatureBrowser
          features={AREA_FEATURES}
          selectedFeatureId="B"
          onSelect={vi.fn()}
        />,
      ),
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
      withDomain(
        <FeatureBrowser
          features={AREA_FEATURES}
          selectedFeatureId={null}
          onSelect={vi.fn()}
        />,
      ),
    );

    fireEvent.change(screen.getByTestId("feature-browser-filter"), {
      target: { value: "sosh" },
    });

    expect(screen.queryByText("Mamelodi")).not.toBeInTheDocument();
    expect(screen.getByText("Soshanguve")).toBeInTheDocument();
  });

  it("shows an empty-state message when nothing matches the filter", () => {
    render(
      withDomain(
        <FeatureBrowser
          features={AREA_FEATURES}
          selectedFeatureId={null}
          onSelect={vi.fn()}
        />,
      ),
    );

    fireEvent.change(screen.getByTestId("feature-browser-filter"), {
      target: { value: "nothing matches this" },
    });

    expect(
      screen.getByText("Nothing matched that search."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("uses custom copy for the filter label, placeholder and empty message when given", () => {
    render(
      withDomain(
        <FeatureBrowser
          features={AREA_FEATURES}
          selectedFeatureId={null}
          onSelect={vi.fn()}
          filterLabel="Filtreer kenmerke"
          filterPlaceholder="Soek volgens naam"
          emptyMessage="Niks het by daardie soektog gepas nie."
        />,
      ),
    );

    expect(screen.getByText("Filtreer kenmerke")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Soek volgens naam"),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("feature-browser-filter"), {
      target: { value: "nothing matches this" },
    });

    expect(
      screen.getByText("Niks het by daardie soektog gepas nie."),
    ).toBeInTheDocument();
  });

  it("falls back to the raw layer id as a heading when the layer isn't in the registry", () => {
    render(
      withDomain(
        <FeatureBrowser
          features={[{ id: "Z", label: "Ghost", layerId: "unknown-layer" }]}
          selectedFeatureId={null}
          onSelect={vi.fn()}
        />,
      ),
    );

    expect(
      screen.getByRole("heading", { name: "unknown-layer" }),
    ).toBeInTheDocument();
  });
});
