import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  installClientErrorReporting,
  reportClientError,
} from "./clientErrorReporting";
import { CLIENT_ERROR_REPORT_PATH } from "./constants/clientErrorReporting";

async function readBeaconBody(blob: unknown): Promise<Record<string, unknown>> {
  const text = await (blob as Blob).text();
  return JSON.parse(text);
}

describe("clientErrorReporting", () => {
  let sendBeaconMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sendBeaconMock = vi.fn().mockReturnValue(true);
    vi.stubGlobal("navigator", {
      ...navigator,
      sendBeacon: sendBeaconMock,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("reportClientError", () => {
    it("sends an Error's message, stack, current URL, and source via sendBeacon", async () => {
      const error = new Error("boom");
      reportClientError(error, "error");

      expect(sendBeaconMock).toHaveBeenCalledTimes(1);
      const [path, blob] = sendBeaconMock.mock.calls[0];
      expect(path).toBe(CLIENT_ERROR_REPORT_PATH);
      const body = await readBeaconBody(blob);
      expect(body.message).toBe("boom");
      expect(body.stack).toContain("boom");
      expect(body.url).toBe(window.location.href);
      expect(body.source).toBe("error");
    });

    it("stringifies a non-Error reason with no stack", async () => {
      reportClientError("something went wrong", "unhandledrejection");

      const body = await readBeaconBody(sendBeaconMock.mock.calls[0][1]);
      expect(body.message).toBe("something went wrong");
      expect(body.stack).toBeUndefined();
      expect(body.source).toBe("unhandledrejection");
    });

    it("truncates an oversized message rather than sending it whole", async () => {
      reportClientError(new Error("x".repeat(5000)), "error");

      const body = await readBeaconBody(sendBeaconMock.mock.calls[0][1]);
      expect((body.message as string).length).toBeLessThan(5000);
    });

    it("falls back to fetch with keepalive when sendBeacon is unavailable", async () => {
      vi.stubGlobal("navigator", { ...navigator, sendBeacon: undefined });
      const fetchMock = vi.fn().mockResolvedValue(new Response(null));
      vi.stubGlobal("fetch", fetchMock);

      reportClientError(new Error("boom"), "error");

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [path, init] = fetchMock.mock.calls[0];
      expect(path).toBe(CLIENT_ERROR_REPORT_PATH);
      expect(init).toMatchObject({ method: "POST", keepalive: true });
    });

    it("never throws, even if sendBeacon itself throws", () => {
      sendBeaconMock.mockImplementation(() => {
        throw new Error("nope");
      });

      expect(() => reportClientError(new Error("boom"), "error")).not.toThrow();
    });
  });

  describe("installClientErrorReporting", () => {
    beforeAll(() => {
      installClientErrorReporting();
    });

    it("reports an uncaught script error", async () => {
      const event = new Event("error") as ErrorEvent;
      Object.defineProperty(event, "error", {
        value: new Error("script boom"),
      });
      window.dispatchEvent(event);

      expect(sendBeaconMock).toHaveBeenCalledTimes(1);
      const body = await readBeaconBody(sendBeaconMock.mock.calls[0][1]);
      expect(body.message).toBe("script boom");
      expect(body.source).toBe("error");
    });

    it("reports an unhandled promise rejection", async () => {
      const event = new Event("unhandledrejection") as PromiseRejectionEvent;
      Object.defineProperty(event, "reason", { value: new Error("rejected") });
      window.dispatchEvent(event);

      expect(sendBeaconMock).toHaveBeenCalledTimes(1);
      const body = await readBeaconBody(sendBeaconMock.mock.calls[0][1]);
      expect(body.message).toBe("rejected");
      expect(body.source).toBe("unhandledrejection");
    });
  });
});
