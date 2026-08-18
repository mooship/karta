import { DEFAULT_DOMAIN_ID } from "@karta/app";
import { describe, expect, it } from "vitest";
import { loader } from "./home";

describe("home route loader", () => {
  it("redirects to the default domain's route", () => {
    const response = loader();

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(`/d/${DEFAULT_DOMAIN_ID}`);
  });
});
