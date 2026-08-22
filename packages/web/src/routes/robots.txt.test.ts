import { describe, expect, it } from "vitest";
import { SITE_URL } from "../constants/siteConfig";
import { loader } from "./robots.txt";

describe("/robots.txt route", () => {
  it("allows all crawlers and points at the generated sitemap", async () => {
    const response = loader();
    const body = await response.text();

    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });
});
