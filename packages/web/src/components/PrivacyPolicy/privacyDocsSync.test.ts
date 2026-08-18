import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.join(__dirname, "../../../../..");

/** Section names from `PRIVACY.md`'s `**Label:** ...` bold-lead-in paragraphs, in order. */
function readMarkdownSectionNames(): string[] {
  const markdown = readFileSync(path.join(REPO_ROOT, "PRIVACY.md"), "utf8");
  const matches = markdown.matchAll(/^\*\*([^*]+):\*\*/gm);
  return [...matches].map((match) => match[1]?.trim() ?? "");
}

/** Section names from `PrivacyPolicy.tsx`'s `<h2>...</h2>` headings, in order. */
function readComponentSectionNames(): string[] {
  const source = readFileSync(
    path.join(__dirname, "PrivacyPolicy.tsx"),
    "utf8",
  );
  const matches = source.matchAll(/<h2[^>]*>\s*([^<{]+?)\s*<\/h2>/g);
  return [...matches].map((match) => match[1]?.trim() ?? "");
}

describe("PRIVACY.md / PrivacyPolicy.tsx sync", () => {
  it("declares the exact same set of sections, in the same order", () => {
    const markdownSections = readMarkdownSectionNames();
    const componentSections = readComponentSectionNames();

    expect(markdownSections.length).toBeGreaterThan(0);
    expect(markdownSections).toEqual(componentSections);
  });
});
