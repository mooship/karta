import { describe, expect, it, vi } from "vitest";
import {
  handleLayerUsageRequest,
  parseLayerUsageEvents,
  recordLayerUsageEvents,
} from "./layerUsage";

const KNOWN_LAYER_IDS = ["townships", "rapid-rail", "heritage-sites"];

describe("parseLayerUsageEvents", () => {
  it("parses a single valid event", () => {
    const body = JSON.stringify({
      events: [{ layerId: "townships", visible: true }],
    });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toEqual([
      { layerId: "townships", visible: true },
    ]);
  });

  it("parses multiple valid events", () => {
    const body = JSON.stringify({
      events: [
        { layerId: "townships", visible: true },
        { layerId: "rapid-rail", visible: false },
      ],
    });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toEqual([
      { layerId: "townships", visible: true },
      { layerId: "rapid-rail", visible: false },
    ]);
  });

  it("drops an event whose layerId isn't a known, published layer", () => {
    const body = JSON.stringify({
      events: [
        { layerId: "townships", visible: true },
        { layerId: "not-a-real-layer", visible: true },
      ],
    });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toEqual([
      { layerId: "townships", visible: true },
    ]);
  });

  it("drops an event with a non-string layerId or non-boolean visible", () => {
    const body = JSON.stringify({
      events: [
        { layerId: 123, visible: true },
        { layerId: "townships", visible: "true" },
      ],
    });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toEqual([]);
  });

  it("drops a null or non-object entry in events", () => {
    const body = JSON.stringify({ events: [null, "not-an-object", 42] });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toEqual([]);
  });

  it("rejects the whole payload when events has more than 20 entries", () => {
    const events = Array.from({ length: 21 }, () => ({
      layerId: "townships",
      visible: true,
    }));
    const body = JSON.stringify({ events });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toEqual([]);
  });

  it("accepts exactly 20 events", () => {
    const events = Array.from({ length: 20 }, (_, index) => ({
      layerId: index % 2 === 0 ? "townships" : "rapid-rail",
      visible: true,
    }));
    const body = JSON.stringify({ events });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toHaveLength(20);
  });

  it("rejects a body larger than 1KB", () => {
    const body = JSON.stringify({
      events: [
        { layerId: "townships", visible: true, padding: "x".repeat(2000) },
      ],
    });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toEqual([]);
  });

  it("rejects invalid JSON", () => {
    expect(parseLayerUsageEvents("not json", KNOWN_LAYER_IDS)).toEqual([]);
  });

  it("rejects a payload whose top level isn't an object with an events array", () => {
    expect(parseLayerUsageEvents("null", KNOWN_LAYER_IDS)).toEqual([]);
    expect(parseLayerUsageEvents("[]", KNOWN_LAYER_IDS)).toEqual([]);
    expect(parseLayerUsageEvents("{}", KNOWN_LAYER_IDS)).toEqual([]);
    expect(
      parseLayerUsageEvents(
        JSON.stringify({ events: "nope" }),
        KNOWN_LAYER_IDS,
      ),
    ).toEqual([]);
  });

  it("ignores extra keys on an otherwise-valid event", () => {
    const body = JSON.stringify({
      events: [
        {
          layerId: "townships",
          visible: true,
          timestamp: Date.now(),
          sessionId: "abc",
        },
      ],
    });

    expect(parseLayerUsageEvents(body, KNOWN_LAYER_IDS)).toEqual([
      { layerId: "townships", visible: true },
    ]);
  });
});

describe("recordLayerUsageEvents", () => {
  it("writes one data point per event, indexed by layerId", () => {
    const dataset = { writeDataPoint: vi.fn() };

    recordLayerUsageEvents(dataset, [
      { layerId: "townships", visible: true },
      { layerId: "rapid-rail", visible: false },
    ]);

    expect(dataset.writeDataPoint).toHaveBeenCalledTimes(2);
    expect(dataset.writeDataPoint).toHaveBeenNthCalledWith(1, {
      blobs: ["townships", "visible"],
      indexes: ["townships"],
    });
    expect(dataset.writeDataPoint).toHaveBeenNthCalledWith(2, {
      blobs: ["rapid-rail", "hidden"],
      indexes: ["rapid-rail"],
    });
  });

  it("writes nothing for an empty event list", () => {
    const dataset = { writeDataPoint: vi.fn() };

    recordLayerUsageEvents(dataset, []);

    expect(dataset.writeDataPoint).not.toHaveBeenCalled();
  });
});

describe("handleLayerUsageRequest", () => {
  it("responds 204 and records valid events", async () => {
    const dataset = { writeDataPoint: vi.fn() };
    const request = new Request("https://example.com/api/layer-usage", {
      method: "POST",
      body: JSON.stringify({
        events: [{ layerId: "townships", visible: true }],
      }),
    });

    const response = await handleLayerUsageRequest(
      request,
      dataset,
      KNOWN_LAYER_IDS,
    );

    expect(response.status).toBe(204);
    expect(dataset.writeDataPoint).toHaveBeenCalledTimes(1);
  });

  it("still responds 204 for invalid input, and never carries a distinguishing body", async () => {
    const dataset = { writeDataPoint: vi.fn() };
    const request = new Request("https://example.com/api/layer-usage", {
      method: "POST",
      body: "not json",
    });

    const response = await handleLayerUsageRequest(
      request,
      dataset,
      KNOWN_LAYER_IDS,
    );

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(dataset.writeDataPoint).not.toHaveBeenCalled();
  });

  it("responds 204 without throwing when no dataset binding is available", async () => {
    const request = new Request("https://example.com/api/layer-usage", {
      method: "POST",
      body: JSON.stringify({
        events: [{ layerId: "townships", visible: true }],
      }),
    });

    const response = await handleLayerUsageRequest(
      request,
      undefined,
      KNOWN_LAYER_IDS,
    );

    expect(response.status).toBe(204);
  });
});
