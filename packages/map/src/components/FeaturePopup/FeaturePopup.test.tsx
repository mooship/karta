import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturePopup } from "./FeaturePopup";

const properties = {
  name: "Mamelodi SP",
  population: 334577,
  commuteMinutes: 62,
  nearestJobCenter: "Pretoria CBD",
  distanceKm: null,
};

describe("FeaturePopup", () => {
  it("renders the title and each field's label and formatted value", () => {
    render(
      <FeaturePopup
        title="Mamelodi SP"
        properties={properties}
        fields={[
          { key: "commuteMinutes", label: "Modelled car time" },
          { key: "nearestJobCenter", label: "Nearest job centre" },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Mamelodi SP" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Modelled car time")).toBeInTheDocument();
    expect(screen.getByText("62")).toBeInTheDocument();
    expect(screen.getByText("Nearest job centre")).toBeInTheDocument();
    expect(screen.getByText("Pretoria CBD")).toBeInTheDocument();
  });

  it("formats a field's value via its own formatValue function", () => {
    render(
      <FeaturePopup
        title="Mamelodi SP"
        properties={properties}
        fields={[
          {
            key: "population",
            label: "Population",
            formatValue: (value) => `${value} people`,
          },
        ]}
      />,
    );

    expect(screen.getByText("334577 people")).toBeInTheDocument();
  });

  it("omits a field by default when its value is null or undefined", () => {
    render(
      <FeaturePopup
        title="Mamelodi SP"
        properties={properties}
        fields={[
          { key: "distanceKm", label: "Distance" },
          { key: "missing", label: "Missing field" },
        ]}
      />,
    );

    expect(screen.queryByText("Distance")).not.toBeInTheDocument();
    expect(screen.queryByText("Missing field")).not.toBeInTheDocument();
  });

  it("still renders a field with a null/undefined value when hideWhenEmpty is false", () => {
    render(
      <FeaturePopup
        title="Mamelodi SP"
        properties={properties}
        fields={[
          {
            key: "distanceKm",
            label: "Distance",
            hideWhenEmpty: false,
            formatValue: (value) =>
              value === null ? "No data" : String(value),
          },
        ]}
      />,
    );

    expect(screen.getByText("Distance")).toBeInTheDocument();
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders fields in the order given, skipping hidden ones without leaving gaps", () => {
    render(
      <FeaturePopup
        title="Mamelodi SP"
        properties={properties}
        fields={[
          { key: "distanceKm", label: "Distance" },
          { key: "commuteMinutes", label: "Modelled car time" },
          { key: "nearestJobCenter", label: "Nearest job centre" },
        ]}
      />,
    );

    const labels = screen.getAllByRole("term").map((el) => el.textContent);
    expect(labels).toEqual(["Modelled car time", "Nearest job centre"]);
  });

  it("renders a numeric field's value in the monospace tabular-figures style", () => {
    render(
      <FeaturePopup
        title="Mamelodi SP"
        properties={properties}
        fields={[
          { key: "commuteMinutes", label: "Modelled car time", numeric: true },
        ]}
      />,
    );

    expect(screen.getByText("62").className).toContain("numeric");
  });
});
