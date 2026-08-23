import { describe, expect, it } from "vitest";
import { links, meta } from "./privacy";

describe("privacy route links", () => {
  it("sets a canonical link to /privacy", () => {
    const rels = links();

    expect(rels).toContainEqual({
      rel: "canonical",
      href: "https://karta.timothybrits.co.za/privacy",
    });
  });
});

describe("privacy route meta", () => {
  it("sets its own title and description rather than the root route's", () => {
    const tags = meta({} as never);

    expect(tags).toContainEqual({ title: "Privacy policy — Karta" });
    expect(tags).toContainEqual(
      expect.objectContaining({
        name: "description",
        content: expect.stringContaining("privacy policy"),
      }),
    );
  });

  it("derives its Open Graph/JSON-LD tags from its own URL and title, not the root route's", () => {
    const tags = meta({} as never);

    expect(tags).toContainEqual({
      property: "og:url",
      content: "https://karta.timothybrits.co.za/privacy",
    });
    expect(tags).toContainEqual({
      property: "og:title",
      content: "Privacy policy — Karta",
    });

    const jsonLdTag = tags.find((tag) => "script:ld+json" in tag) as
      | { "script:ld+json": Record<string, unknown> }
      | undefined;
    expect(jsonLdTag?.["script:ld+json"]).toMatchObject({
      name: "Privacy policy — Karta",
      url: "https://karta.timothybrits.co.za/privacy",
    });
  });

  it("still carries the site-wide Open Graph tags shared with every route", () => {
    const tags = meta({} as never);

    expect(tags).toContainEqual({ property: "og:type", content: "website" });
    expect(tags).toContainEqual(
      expect.objectContaining({ name: "twitter:card" }),
    );
  });
});
