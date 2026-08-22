import { describe, expect, it } from "vitest";
import { SITE_URL } from "../constants/siteConfig";
import { loader } from "./llms.txt";

describe("/llms.txt route", () => {
  it("summarises the site and lists the published domain's layers and story", async () => {
    const response = loader();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(body).toContain(`[Map](${SITE_URL}/)`);
    expect(body).toContain(`[Privacy Policy](${SITE_URL}/privacy)`);
    expect(body).toContain("Rapid Rail");
    expect(body).toContain("Why this map exists");
  });
});
