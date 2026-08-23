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
  it("overrides the title and description rather than inheriting the root's", () => {
    const tags = meta({
      matches: [
        {
          meta: [
            { title: "Karta: Gauteng spatial legacy map" },
            { name: "description", content: "root description" },
            { property: "og:type", content: "website" },
          ],
        },
      ],
    } as never);

    expect(tags).toContainEqual({ title: "Privacy policy — Karta" });
    expect(tags).toContainEqual(
      expect.objectContaining({ name: "description" }),
    );
    expect(tags.filter((tag) => "title" in tag)).toHaveLength(1);
    expect(
      tags.filter((tag) => "name" in tag && tag.name === "description"),
    ).toHaveLength(1);
  });

  it("still carries over unrelated root meta, like Open Graph tags", () => {
    const tags = meta({
      matches: [
        {
          meta: [
            { title: "Karta: Gauteng spatial legacy map" },
            { name: "description", content: "root description" },
            { property: "og:type", content: "website" },
          ],
        },
      ],
    } as never);

    expect(tags).toContainEqual({ property: "og:type", content: "website" });
  });
});
