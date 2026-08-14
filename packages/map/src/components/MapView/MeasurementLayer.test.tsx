import { act, render, screen } from "@testing-library/react";
import type { LatLng } from "leaflet";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mapEventsMocks = vi.hoisted(() => ({
  handlers: {} as { click?: (event: { latlng: LatLng }) => void },
}));

vi.mock("react-leaflet", () => ({
  useMapEvents: (handlers: typeof mapEventsMocks.handlers) => {
    mapEventsMocks.handlers = handlers;
    return {};
  },
  Polyline: ({ positions }: { positions: LatLng[] }) => (
    <div data-testid="measurement-polyline">{positions.length}</div>
  ),
  Polygon: ({ positions }: { positions: LatLng[] }) => (
    <div data-testid="measurement-polygon">{positions.length}</div>
  ),
  CircleMarker: ({ children }: { children?: ReactNode }) => (
    <div data-testid="measurement-vertex">{children}</div>
  ),
}));

import { MeasurementLayer } from "./MeasurementLayer";

function clickMap(latlng: LatLng) {
  act(() => {
    mapEventsMocks.handlers.click?.({ latlng });
  });
}

const POINT_A = { lat: -26.2, lng: 28.0 } as LatLng;
const POINT_B = { lat: -26.21, lng: 28.01 } as LatLng;
const POINT_C = { lat: -26.19, lng: 28.02 } as LatLng;

describe("MeasurementLayer", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls onAddPoint with the clicked latlng", () => {
    const onAddPoint = vi.fn();
    render(
      <MeasurementLayer mode="distance" points={[]} onAddPoint={onAddPoint} />,
    );

    clickMap(POINT_A);

    expect(onAddPoint).toHaveBeenCalledWith(POINT_A);
  });

  it("renders a vertex marker per point", () => {
    render(
      <MeasurementLayer
        mode="distance"
        points={[POINT_A, POINT_B]}
        onAddPoint={vi.fn()}
      />,
    );

    expect(screen.getAllByTestId("measurement-vertex")).toHaveLength(2);
  });

  it("renders no line with fewer than two points in distance mode", () => {
    render(
      <MeasurementLayer
        mode="distance"
        points={[POINT_A]}
        onAddPoint={vi.fn()}
      />,
    );

    expect(
      screen.queryByTestId("measurement-polyline"),
    ).not.toBeInTheDocument();
  });

  it("renders a Polyline once there are at least two points in distance mode", () => {
    render(
      <MeasurementLayer
        mode="distance"
        points={[POINT_A, POINT_B]}
        onAddPoint={vi.fn()}
      />,
    );

    expect(screen.getByTestId("measurement-polyline")).toHaveTextContent("2");
    expect(screen.queryByTestId("measurement-polygon")).not.toBeInTheDocument();
  });

  it("renders no polygon with fewer than three points in area mode", () => {
    render(
      <MeasurementLayer
        mode="area"
        points={[POINT_A, POINT_B]}
        onAddPoint={vi.fn()}
      />,
    );

    expect(screen.queryByTestId("measurement-polygon")).not.toBeInTheDocument();
  });

  it("renders a Polygon once there are at least three points in area mode", () => {
    render(
      <MeasurementLayer
        mode="area"
        points={[POINT_A, POINT_B, POINT_C]}
        onAddPoint={vi.fn()}
      />,
    );

    expect(screen.getByTestId("measurement-polygon")).toHaveTextContent("3");
    expect(
      screen.queryByTestId("measurement-polyline"),
    ).not.toBeInTheDocument();
  });
});
