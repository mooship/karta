import { act, render, screen, waitFor } from "@testing-library/react";
import type { LatLng } from "leaflet";
import { afterEach, describe, expect, it, vi } from "vitest";

const canHoverMocks = vi.hoisted(() => ({ value: true }));

const mapEventsMocks = vi.hoisted(() => ({
  handlers: {} as {
    click?: (event: { latlng: LatLng }) => void;
    mousemove?: (event: { latlng: LatLng }) => void;
    mouseout?: () => void;
  },
}));

vi.mock("@karta/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@karta/react")>()),
  useCanHover: () => canHoverMocks.value,
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
  CircleMarker: () => <div data-testid="measurement-vertex" />,
}));

import { MeasurementLayer } from "./MeasurementLayer";

function clickMap(latlng: LatLng) {
  act(() => {
    mapEventsMocks.handlers.click?.({ latlng });
  });
}

function moveMouseTo(latlng: LatLng) {
  act(() => {
    mapEventsMocks.handlers.mousemove?.({ latlng });
  });
}

function moveMouseOut() {
  act(() => {
    mapEventsMocks.handlers.mouseout?.();
  });
}

const POINT_A = { lat: -26.2, lng: 28.0 } as LatLng;
const POINT_B = { lat: -26.21, lng: 28.01 } as LatLng;
const POINT_C = { lat: -26.19, lng: 28.02 } as LatLng;
const HOVER_POINT = { lat: -26.205, lng: 28.005 } as LatLng;

describe("MeasurementLayer", () => {
  afterEach(() => {
    vi.clearAllMocks();
    canHoverMocks.value = true;
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

  it("renders a line between two points in area mode, previewing the polygon", () => {
    render(
      <MeasurementLayer
        mode="area"
        points={[POINT_A, POINT_B]}
        onAddPoint={vi.fn()}
      />,
    );

    expect(screen.getByTestId("measurement-polyline")).toHaveTextContent("2");
    expect(screen.queryByTestId("measurement-polygon")).not.toBeInTheDocument();
  });

  describe("hover preview", () => {
    it("does not wire up a mousemove listener when the pointer can't hover", () => {
      canHoverMocks.value = false;
      render(
        <MeasurementLayer
          mode="distance"
          points={[POINT_A]}
          onAddPoint={vi.fn()}
        />,
      );

      expect(mapEventsMocks.handlers.mousemove).toBeUndefined();
    });

    it("does not preview before any point has been placed", () => {
      render(
        <MeasurementLayer mode="distance" points={[]} onAddPoint={vi.fn()} />,
      );

      moveMouseTo(HOVER_POINT);

      expect(
        screen.queryByTestId("measurement-polyline"),
      ).not.toBeInTheDocument();
    });

    it("coalesces mousemoves within the same animation frame into a single scheduled update", () => {
      const rafSpy = vi.fn().mockReturnValue(1);
      vi.stubGlobal("requestAnimationFrame", rafSpy);

      render(
        <MeasurementLayer
          mode="distance"
          points={[POINT_A]}
          onAddPoint={vi.fn()}
        />,
      );

      moveMouseTo(HOVER_POINT);
      moveMouseTo(POINT_C);

      expect(rafSpy).toHaveBeenCalledTimes(1);

      act(() => {
        rafSpy.mock.calls[0]?.[0]?.(0);
      });

      expect(screen.getByTestId("measurement-polyline")).toHaveTextContent("2");

      vi.unstubAllGlobals();
    });

    it("previews a dashed line to the hovered point in distance mode", async () => {
      render(
        <MeasurementLayer
          mode="distance"
          points={[POINT_A]}
          onAddPoint={vi.fn()}
        />,
      );

      moveMouseTo(HOVER_POINT);

      await waitFor(() =>
        expect(screen.getByTestId("measurement-polyline")).toHaveTextContent(
          "2",
        ),
      );
      expect(screen.getAllByTestId("measurement-vertex")).toHaveLength(2);
    });

    it("previews the polygon shape once hovering past two points in area mode", async () => {
      render(
        <MeasurementLayer
          mode="area"
          points={[POINT_A, POINT_B]}
          onAddPoint={vi.fn()}
        />,
      );

      moveMouseTo(HOVER_POINT);

      await waitFor(() =>
        expect(screen.getByTestId("measurement-polygon")).toHaveTextContent(
          "3",
        ),
      );
      expect(
        screen.queryByTestId("measurement-polyline"),
      ).not.toBeInTheDocument();
    });

    it("clears the preview on mouseout", async () => {
      render(
        <MeasurementLayer
          mode="distance"
          points={[POINT_A]}
          onAddPoint={vi.fn()}
        />,
      );

      moveMouseTo(HOVER_POINT);
      await waitFor(() =>
        expect(screen.getByTestId("measurement-polyline")).toBeInTheDocument(),
      );

      moveMouseOut();

      expect(
        screen.queryByTestId("measurement-polyline"),
      ).not.toBeInTheDocument();
    });

    it("clears the preview once the hovered point is clicked", () => {
      const onAddPoint = vi.fn();
      render(
        <MeasurementLayer
          mode="distance"
          points={[POINT_A]}
          onAddPoint={onAddPoint}
        />,
      );

      moveMouseTo(HOVER_POINT);
      clickMap(HOVER_POINT);

      expect(onAddPoint).toHaveBeenCalledWith(HOVER_POINT);
      expect(screen.getAllByTestId("measurement-vertex")).toHaveLength(1);
    });
  });
});
