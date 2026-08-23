import { describe, expect, it } from "vitest";
import { links } from "./home";

describe("home route links", () => {
  it("sets a canonical link to the site root", () => {
    const rels = links();

    expect(rels).toContainEqual({
      rel: "canonical",
      href: "https://karta.timothybrits.co.za",
    });
  });
});
