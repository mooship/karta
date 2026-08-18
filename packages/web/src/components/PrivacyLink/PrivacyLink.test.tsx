import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrivacyLink } from "./PrivacyLink";

describe("PrivacyLink", () => {
  it("links to the /privacy route", () => {
    render(<PrivacyLink />);

    expect(screen.getByTestId("privacy-link")).toHaveAttribute(
      "href",
      "/privacy",
    );
  });
});
