import { afterEach, describe, expect, it, vi } from "vitest";
import { stubMatchMedia } from "./stubMatchMedia";

describe("stubMatchMedia", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("only tracks a listener registered for the 'change' event", () => {
    const { mediaQueryList, triggerChange } = stubMatchMedia(false);
    const otherListener = vi.fn();
    mediaQueryList.addEventListener("click", otherListener);

    triggerChange(true);

    expect(otherListener).not.toHaveBeenCalled();
  });

  it("does not clear the tracked change listener when removing a different listener", () => {
    const { mediaQueryList, triggerChange } = stubMatchMedia(false);
    const changeListener = vi.fn();
    mediaQueryList.addEventListener("change", changeListener);

    mediaQueryList.removeEventListener("change", vi.fn());
    triggerChange(true);

    expect(changeListener).toHaveBeenCalledTimes(1);
  });

  it("does not clear the tracked listener when removing a non-'change' event", () => {
    const { mediaQueryList, triggerChange } = stubMatchMedia(false);
    const changeListener = vi.fn();
    mediaQueryList.addEventListener("change", changeListener);

    mediaQueryList.removeEventListener("click", changeListener);
    triggerChange(true);

    expect(changeListener).toHaveBeenCalledTimes(1);
  });

  it("stops notifying a change listener once it's removed", () => {
    const { mediaQueryList, triggerChange } = stubMatchMedia(false);
    const changeListener = vi.fn();
    mediaQueryList.addEventListener("change", changeListener);

    mediaQueryList.removeEventListener("change", changeListener);
    triggerChange(true);

    expect(changeListener).not.toHaveBeenCalled();
  });
});
