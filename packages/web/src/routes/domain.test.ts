import { describe, expect, it, vi } from "vitest";

const { getLocale } = vi.hoisted(() => ({
  getLocale: vi.fn(() => "en"),
}));

vi.mock("../paraglide/runtime.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../paraglide/runtime.js")>();
  return { ...actual, getLocale };
});

import type { LoaderFunctionArgs } from "react-router";
import { loader, meta } from "./domain";

function loaderArgs(domainId: string): LoaderFunctionArgs {
  return { params: { domainId } } as LoaderFunctionArgs;
}

describe("domain route loader", () => {
  it("returns the domainId for a registered domain", () => {
    expect(loader(loaderArgs("gauteng-spatial-legacy"))).toEqual({
      domainId: "gauteng-spatial-legacy",
    });
    expect(loader(loaderArgs("heritage-sites"))).toEqual({
      domainId: "heritage-sites",
    });
  });

  it("throws a 404 Response for an unregistered domain id", () => {
    try {
      loader(loaderArgs("not-a-real-domain"));
      expect.unreachable("loader should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).status).toBe(404);
    }
  });

  it("throws a 404 Response when no domainId param is present", () => {
    expect(() => loader({ params: {} } as LoaderFunctionArgs)).toThrow(
      Response,
    );
  });
});

describe("domain route meta", () => {
  it("includes the domain's localized label in the title and its story as the description", () => {
    const result = meta({
      loaderData: { domainId: "heritage-sites" },
    } as Parameters<typeof meta>[0]);

    expect(result).toEqual([
      { title: expect.stringContaining("Heritage sites") },
      { name: "description", content: expect.any(String) },
    ]);
  });

  it("falls back to the app-wide title/description when loaderData is undefined", () => {
    const result = meta({
      loaderData: undefined,
    } as Parameters<typeof meta>[0]);

    expect(result[0]).toEqual({ title: "Karta" });
    expect(result[1]).toMatchObject({ name: "description" });
  });
});
