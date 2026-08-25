import type { ActionFunctionArgs } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH } from "../constants/clientErrorReporting";
import { action } from "./log-error";

function makeRequest(
  body: unknown,
  method = "POST",
  rawBody?: string,
): ActionFunctionArgs {
  const request = new Request("https://karta.timothybrits.co.za/log-error", {
    method,
    headers: { "Content-Type": "application/json" },
    body:
      method === "GET" || method === "HEAD"
        ? undefined
        : (rawBody ?? JSON.stringify(body)),
  });
  return { request, params: {}, context: {} } as ActionFunctionArgs;
}

describe("/log-error route action", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs a valid client error report and responds 204", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await action(
      makeRequest({
        message: "boom",
        stack: "Error: boom\n at foo",
        url: "https://karta.timothybrits.co.za/",
        source: "error",
      }),
    );

    expect(response.status).toBe(204);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("accepts a report with no stack", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await action(
      makeRequest({
        message: "boom",
        url: "https://karta.timothybrits.co.za/",
        source: "unhandledrejection",
      }),
    );

    expect(response.status).toBe(204);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["a malformed payload", { message: 123 }, undefined],
    ["a body that isn't valid JSON", undefined, "not json"],
    [
      "a field longer than the maximum length",
      {
        message: "x".repeat(CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH + 1),
        url: "https://karta.timothybrits.co.za/",
        source: "error",
      },
      undefined,
    ],
  ] as const)("rejects %s without logging", async (_case, body, rawBody) => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await action(makeRequest(body, "POST", rawBody));

    expect(response.status).toBe(400);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("rejects non-POST methods", async () => {
    const response = await action(makeRequest(undefined, "GET"));

    expect(response.status).toBe(405);
  });
});
