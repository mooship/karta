import { describe, expect, it } from "vitest";
import { SITE_URL } from "../constants/siteConfig";
import { loader } from "./sitemap.xml";

describe("/sitemap.xml route", () => {
  it("lists every published route as an absolute URL", async () => {
    const response = loader();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
    expect(body).toContain(`<loc>${SITE_URL}/</loc>`);
    expect(body).toContain(`<loc>${SITE_URL}/privacy</loc>`);
  });
});
