import type { TollgateProperties } from "@karta/app";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TollgatePopup } from "./TollgatePopup";

const properties: TollgateProperties = {
  id: "grasmere",
  name: "Grasmere Toll Plaza",
  route: "N1",
  operator: "SANRAL",
};

describe("TollgatePopup", () => {
  it("shows name, route, and operator", () => {
    render(<TollgatePopup properties={properties} />);

    expect(screen.getByText("Grasmere Toll Plaza")).toBeInTheDocument();
    expect(screen.getByText("Route")).toBeInTheDocument();
    expect(screen.getByText("N1")).toBeInTheDocument();
    expect(screen.getByText("Operator")).toBeInTheDocument();
    expect(screen.getByText("SANRAL")).toBeInTheDocument();
  });
});
