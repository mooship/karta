/** One layer's usage event: a toggle to on (`visible: true`) or off (`visible: false`). */
export interface LayerUsageEvent {
  layerId: string;
  visible: boolean;
}

/** Maximum events accepted in a single `/api/layer-usage` request. */
const MAX_EVENTS = 20;

/** Maximum request body size (bytes) accepted for `/api/layer-usage`. */
const MAX_BODY_BYTES = 1024;

/**
 * Cloudflare Analytics Engine's `writeDataPoint` shape, the only method this
 * app calls on the binding.
 * @remarks Declared locally rather than depending on `@cloudflare/workers-types`
 *   for one method — `workers/app.ts`, the only caller with a real binding to
 *   pass, isn't covered by this package's `tsconfig.json` (see that file's
 *   own doc comment) and so isn't typechecked either way.
 */
export interface AnalyticsEngineDataset {
  writeDataPoint(event: {
    blobs?: string[];
    doubles?: number[];
    indexes?: string[];
  }): void;
}

/**
 * Parses and validates a `/api/layer-usage` request body into the
 * `LayerUsageEvent`s it's safe to record.
 * @param knownLayerIds - Every registered domain's published layer ids
 *   (see `getAllKnownLayerIds`). An event naming any other id is dropped —
 *   this is what keeps the endpoint from becoming an arbitrary-write
 *   surface, since `blobs`/`indexes` written from it are otherwise
 *   unconstrained strings.
 * @returns Only the individually-valid events; the whole payload is
 *   rejected (returning `[]`) if the body exceeds 1KB, exceeds 20 events,
 *   isn't valid JSON, or isn't shaped like `{ events: [...] }` at all. An
 *   individual malformed event (wrong types, unknown `layerId`, or a
 *   non-object entry) is dropped without rejecting the rest of the batch.
 */
export function parseLayerUsageEvents(
  bodyText: string,
  knownLayerIds: readonly string[],
): LayerUsageEvent[] {
  if (new TextEncoder().encode(bodyText).length > MAX_BODY_BYTES) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return [];
  }

  if (typeof parsed !== "object" || parsed === null || !("events" in parsed)) {
    return [];
  }
  const rawEvents = (parsed as { events: unknown }).events;
  if (!Array.isArray(rawEvents) || rawEvents.length > MAX_EVENTS) {
    return [];
  }

  const events: LayerUsageEvent[] = [];
  for (const rawEvent of rawEvents) {
    if (typeof rawEvent !== "object" || rawEvent === null) {
      continue;
    }
    const { layerId, visible } = rawEvent as Record<string, unknown>;
    if (typeof layerId !== "string" || typeof visible !== "boolean") {
      continue;
    }
    if (!knownLayerIds.includes(layerId)) {
      continue;
    }
    events.push({ layerId, visible });
  }
  return events;
}

/**
 * Writes one Analytics Engine data point per event: `layerId` in both
 * `blobs[0]` and `indexes[0]` (so it's both readable and filterable/groupable
 * in queries), and the resulting state (`"visible"`/`"hidden"`) in
 * `blobs[1]`. No other data — no timestamp, session id, or request
 * metadata — is written; Analytics Engine stamps its own ingestion
 * timestamp automatically.
 */
export function recordLayerUsageEvents(
  dataset: AnalyticsEngineDataset,
  events: LayerUsageEvent[],
): void {
  for (const event of events) {
    dataset.writeDataPoint({
      blobs: [event.layerId, event.visible ? "visible" : "hidden"],
      indexes: [event.layerId],
    });
  }
}

/**
 * Handles a `/api/layer-usage` POST request end to end: parses and
 * validates the body, records whatever's valid, and always responds `204`
 * with an empty body — including for invalid input — so the endpoint can't
 * be used to probe which layer ids are registered or whether a given
 * request validated.
 * @param dataset - The Analytics Engine binding, or `undefined` if it isn't
 *   configured for the current environment (e.g. local development without
 *   the dataset provisioned); events are simply not recorded in that case.
 */
export async function handleLayerUsageRequest(
  request: Request,
  dataset: AnalyticsEngineDataset | undefined,
  knownLayerIds: readonly string[],
): Promise<Response> {
  const bodyText = await request.text();
  const events = parseLayerUsageEvents(bodyText, knownLayerIds);
  if (dataset && events.length > 0) {
    recordLayerUsageEvents(dataset, events);
  }
  return new Response(null, { status: 204 });
}
