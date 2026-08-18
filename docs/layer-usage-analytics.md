# Cookieless layer-usage analytics

Karta's reference app (`packages/web`) records aggregate counts of which map
layers people actually turn on and off — nothing about who they are, when
exactly they did it, or what else they did on the same visit. This is a
deliberate extension of the app's existing "no accounts, no tracking beyond
cookieless page views" stance, not a departure from it.

## What's recorded

Every event is exactly:

```json
{ "layerId": "townships", "visible": true }
```

Nothing else — no timestamp, no session id, no IP address, no cookie, no
user agent. Analytics Engine stamps its own ingestion timestamp on write;
the app never sends one itself. A request can carry up to 20 such events at
once (one HTTP round trip covering a burst of toggles), in a body no larger
than 1KB.

## How it gets there

1. `App.tsx` passes `useLayerUsageBeacon`'s wrapped handler to
   `LayerToggles` as `onToggle`, instead of `useMapUiStore`'s raw
   `toggleLayer` action directly. This is deliberately keyed off the
   **toggle action**, not `visibleLayerIds` state — that state also changes
   on startup defaults and permalink restoration, neither of which is a
   visitor choosing to toggle a layer.
2. `@karta/react`'s `useUsageBeacon` buffers events by a dedupe key
   (`layerId`), collapsing rapid on/off/on toggling of the same layer into
   one event reflecting its latest state, and flushes after ~2 seconds of
   inactivity (or immediately if the page becomes hidden).
3. The flush sends via `navigator.sendBeacon` — chosen specifically because
   it survives page unload without blocking navigation — falling back to
   `fetch(..., { keepalive: true })` if `sendBeacon` is unavailable or
   reports failure.
4. Sending is skipped entirely (though the layer still toggles normally)
   when the browser signals Do Not Track or Global Privacy Control
   (`src/utils/privacySignals.ts`).

## The endpoint

`POST /api/layer-usage`, handled directly in `packages/web/workers/app.ts`
(not a React Router route — see that file's own doc comment for why) via
the framework-free `src/analytics/layerUsage.ts`. It:

- Rejects the whole payload (silently — see below) if the body exceeds 1KB
  or 20 events, isn't valid JSON, or isn't shaped like `{ events: [...] }`.
- Drops any individual event whose `layerId` isn't one of the ids actually
  published by a registered domain (`src/analytics/knownLayerIds.ts`), or
  whose `visible` isn't a boolean — this is what keeps the endpoint from
  becoming an arbitrary-write surface.
- Writes one Analytics Engine data point per surviving event via
  `env.LAYER_USAGE.writeDataPoint()`.
- **Always responds `204` with an empty body**, regardless of whether the
  input was valid — a distinguishable error response would make the
  endpoint an id-enumeration oracle (probe which strings count as "real"
  layer ids by watching the response).

## Querying the counts

This is write-only in v1 — there's no in-app reporting screen. Counts are
queried directly via [Cloudflare's Analytics Engine SQL
API](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/):

```bash
curl "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/analytics_engine/sql" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  --data "
    SELECT
      blob1 AS layer_id,
      blob2 AS state,
      SUM(_sample_interval) AS events
    FROM karta_layer_usage
    WHERE timestamp > NOW() - INTERVAL '7' DAY
    GROUP BY layer_id, state
    ORDER BY events DESC
  "
```

`recordLayerUsageEvents` (`src/analytics/layerUsage.ts`) writes `layerId`
into both `blobs[0]` (readable in query results as `blob1`) and `indexes[0]`
(`index1`, usable to filter/group efficiently), and the resulting state —
`"visible"` or `"hidden"` — into `blobs[1]` (`blob2`). Summing
`_sample_interval` rather than counting rows corrects for Analytics
Engine's sampling on high-volume datasets; at Karta's traffic this is
effectively always `1` per row, but the query is written to stay correct if
that changes.

The API token needs the `Account Analytics: Read` permission. Never commit
`ACCOUNT_ID`/`API_TOKEN` values — pass them as environment variables when
running the query above.
