import { useLatestRef } from "@karta/react";
import type { LatLng, LeafletMouseEvent } from "leaflet";
import { useMemo } from "react";
import { CircleMarker, Polygon, Polyline, useMapEvents } from "react-leaflet";
import type { MeasurementMode } from "../MeasurementControl/MeasurementControl";

/** Distinct from any layer's own palette, for visibility over any basemap or overlay. */
const MEASUREMENT_COLOR = "#e8710a";
const MEASUREMENT_PATH_OPTIONS = {
  color: MEASUREMENT_COLOR,
  weight: 3,
} as const;
const VERTEX_RADIUS_PX = 4;

interface MeasurementLayerProps {
  mode: MeasurementMode;
  points: LatLng[];
  onAddPoint: (point: LatLng) => void;
}

/**
 * The Leaflet-aware half of the measurement tool: captures map clicks as
 * vertices and draws the in-progress line or polygon.
 * @remarks Must be rendered inside the same `MapView`'s `MapContainer` as a
 *   `MeasurementControl` driven by the same `points`/`mode` state — this
 *   component has no UI of its own beyond the drawn preview and per-vertex
 *   markers. A `Polyline`/`Polygon` isn't rendered until there are enough
 *   points to form one (two for a line, three for a polygon), since Leaflet
 *   otherwise renders a stray zero-length path. `onAddPoint` is read through
 *   a ref (see {@link useLatestRef}) so the handlers object passed to
 *   `useMapEvents` keeps one identity across renders — react-leaflet
 *   unbinds and rebinds the real Leaflet click listener whenever that
 *   object's identity changes, which an inline literal would do on every
 *   render, including the ones this component causes itself by adding a
 *   point.
 */
export function MeasurementLayer({
  mode,
  points,
  onAddPoint,
}: MeasurementLayerProps) {
  const onAddPointRef = useLatestRef(onAddPoint);
  const eventHandlers = useMemo(
    () => ({
      click: (event: LeafletMouseEvent) => {
        onAddPointRef.current(event.latlng);
      },
    }),
    [onAddPointRef],
  );
  useMapEvents(eventHandlers);

  const showLine = mode === "distance" && points.length >= 2;
  const showPolygon = mode === "area" && points.length >= 3;

  return (
    <>
      {points.map((point, index) => (
        <CircleMarker
          // biome-ignore lint/suspicious/noArrayIndexKey: vertices are append-only and never reordered while measuring, so index is a stable identity here
          key={index}
          center={point}
          radius={VERTEX_RADIUS_PX}
          pathOptions={{
            ...MEASUREMENT_PATH_OPTIONS,
            fillColor: MEASUREMENT_COLOR,
            fillOpacity: 1,
          }}
        />
      ))}
      {showLine ? (
        <Polyline positions={points} pathOptions={MEASUREMENT_PATH_OPTIONS} />
      ) : null}
      {showPolygon ? (
        <Polygon
          positions={points}
          pathOptions={{ ...MEASUREMENT_PATH_OPTIONS, fillOpacity: 0.15 }}
        />
      ) : null}
    </>
  );
}
