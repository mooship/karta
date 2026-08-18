import { afterEach, describe, expect, it } from "vitest";
import { isDoNotTrackEnabled } from "./privacySignals";

function setNavigatorProperty(name: string, value: unknown) {
  Object.defineProperty(navigator, name, { configurable: true, value });
}

describe("isDoNotTrackEnabled", () => {
  afterEach(() => {
    setNavigatorProperty("doNotTrack", undefined);
    setNavigatorProperty("globalPrivacyControl", undefined);
  });

  it("is false when neither signal is set", () => {
    expect(isDoNotTrackEnabled()).toBe(false);
  });

  it("is true when navigator.doNotTrack is '1'", () => {
    setNavigatorProperty("doNotTrack", "1");

    expect(isDoNotTrackEnabled()).toBe(true);
  });

  it("is false when navigator.doNotTrack is '0' or 'unspecified'", () => {
    setNavigatorProperty("doNotTrack", "0");
    expect(isDoNotTrackEnabled()).toBe(false);

    setNavigatorProperty("doNotTrack", "unspecified");
    expect(isDoNotTrackEnabled()).toBe(false);
  });

  it("is true when navigator.globalPrivacyControl is true", () => {
    setNavigatorProperty("globalPrivacyControl", true);

    expect(isDoNotTrackEnabled()).toBe(true);
  });
});
