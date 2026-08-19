import { useCanHover, useLatestRef } from "@karta/react";
import type {
  LatLng,
  LeafletEventHandlerFnMap,
  LeafletMouseEvent,
} from "leaflet";
import { useMemo, useState } from "react";
import { CircleMarker, Polygon, Polyline, useMapEvents } from "react-leaflet";
import { useRafScheduledValue } from "../../hooks/useRafScheduledValue";
import type { MeasurementMode } from "../MeasurementControl/MeasurementControl";

/** Distinct from any layer's own palette, for visibility over any basemap or overlay. */
const MEASUREMENT_COLOR = "#e8710a";
const MEASUREMENT_PATH_OPTIONS = {
  color: MEASUREMENT_COLOR,
  weight: 3,
} as const;
/** Marks the not-yet-committed segment/edge that follows the cursor. */
const PREVIEW_PATH_OPTIONS = {
  ...MEASUREMENT_PATH_OPTIONS,
  dashArray: "6 6",
} as const;
const DEFAULT_POLYGON_PATH_OPTIONS = {
  ...MEASUREMENT_PATH_OPTIONS,
  fillOpacity: 0.15,
} as const;
const PREVIEW_POLYGON_PATH_OPTIONS = {
  ...PREVIEW_PATH_OPTIONS,
  fillOpacity: 0.08,
} as const;
const VERTEX_RADIUS_PX = 4;
const VERTEX_PATH_OPTIONS = {
  ...MEASUREMENT_PATH_OPTIONS,
  fillColor: MEASUREMENT_COLOR,
  fillOpacity: 1,
} as const;
const HOVER_VERTEX_PATH_OPTIONS = {
  ...MEASUREMENT_PATH_OPTIONS,
  fillColor: MEASUREMENT_COLOR,
  fillOpacity: 0.5,
} as const;

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
 *   points to form one (two for a line; in area mode two points already draw
 *   a straight edge between them so the shape reads as "starting to form",
 *   with the closed `Polygon` taking over from three), since Leaflet
 *   otherwise renders a stray zero-length path. On a hover-capable pointer
 *   (see {@link useCanHover}), once at least one point is placed the shape
 *   also previews one point ahead of the cursor — a dashed edge/vertex
 *   tracking `mousemove`, cleared on `mouseout` or the next click — so the
 *   user can see how the line/polygon would look before committing the next
 *   vertex; touch devices skip this since they have no continuous hover.
 *   `mousemove` updates are batched to one `requestAnimationFrame` per frame
 *   (see `useRafScheduledValue`), so a burst of native mousemove events
 *   while measuring doesn't force a React re-render — and a
 *   `Polyline`/`Polygon`/`CircleMarker` rebuild — for each one; `mouseout`
 *   and a committing click cancel any pending frame so a stale scheduled
 *   point can't overwrite the immediate clear a frame later.
 *   `onAddPoint` is read through a ref (see {@link useLatestRef}) so the
 *   handlers object passed to `useMapEvents` keeps one identity across
 *   renders — react-leaflet unbinds and rebinds the real Leaflet listeners
 *   whenever that object's identity changes, which an inline literal would
 *   do on every render, including the ones this component causes itself by
 *   adding a point or moving the hover preview.
 */
export function MeasurementLayer({
  mode,
  points,
  onAddPoint,
}: MeasurementLayerProps) {
  const canHover = useCanHover();
  const [hoverPoint, setHoverPoint] = useState<LatLng | null>(null);
  const onAddPointRef = useLatestRef(onAddPoint);
  const pointsRef = useLatestRef(points);
  const { schedule: scheduleHoverPoint, cancel: cancelScheduledHoverPoint } =
    useRafScheduledValue(setHoverPoint);

  const eventHandlers = useMemo(
    (): LeafletEventHandlerFnMap => ({
      click: (event: LeafletMouseEvent) => {
        cancelScheduledHoverPoint();
        setHoverPoint(null);
        onAddPointRef.current(event.latlng);
      },
      ...(canHover
        ? {
            mousemove: (event: LeafletMouseEvent) => {
              if (pointsRef.current.length > 0) {
                scheduleHoverPoint(event.latlng);
              }
            },
            mouseout: () => {
              cancelScheduledHoverPoint();
              setHoverPoint(null);
            },
          }
        : {}),
    }),
    [
      canHover,
      onAddPointRef,
      pointsRef,
      cancelScheduledHoverPoint,
      scheduleHoverPoint,
    ],
  );
  useMapEvents(eventHandlers);

  const isPreviewing = hoverPoint !== null;
  const previewPoints = isPreviewing ? [...points, hoverPoint] : points;

  const showLine =
    mode === "distance"
      ? previewPoints.length >= 2
      : previewPoints.length === 2;
  const showPolygon = mode === "area" && previewPoints.length >= 3;

  const linePathOptions = isPreviewing
    ? PREVIEW_PATH_OPTIONS
    : MEASUREMENT_PATH_OPTIONS;
  const polygonPathOptions = isPreviewing
    ? PREVIEW_POLYGON_PATH_OPTIONS
    : DEFAULT_POLYGON_PATH_OPTIONS;

  return (
    <>
      {previewPoints.map((point, index) => (
        <CircleMarker
          // biome-ignore lint/suspicious/noArrayIndexKey: vertices are append-only and never reordered while measuring, so index is a stable identity here
          key={index}
          center={point}
          radius={VERTEX_RADIUS_PX}
          pathOptions={
            isPreviewing && index === previewPoints.length - 1
              ? HOVER_VERTEX_PATH_OPTIONS
              : VERTEX_PATH_OPTIONS
          }
        />
      ))}
      {showLine ? (
        <Polyline positions={previewPoints} pathOptions={linePathOptions} />
      ) : null}
      {showPolygon ? (
        <Polygon positions={previewPoints} pathOptions={polygonPathOptions} />
      ) : null}
    </>
  );
}
