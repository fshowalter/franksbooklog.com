import { describe, expect, it } from "vitest";

import { pageFixtures } from "./__fixtures__/pages";
import { reviewDataFixtures } from "./__fixtures__/reviews";
import { getContentPlainText, getPage } from "./pages";

describe("getPage", () => {
  it("returns undefined when slug is not found", () => {
    expect(
      getPage("nonexistent", pageFixtures, reviewDataFixtures),
    ).toBeUndefined();
  });

  it("returns page data when slug matches", () => {
    const result = getPage("how-i-grade", pageFixtures, reviewDataFixtures);
    expect(result).toBeDefined();
    expect(result?.title).toBe("How I Grade");
    expect(result?.body).toBe("Grading systems are a balancing act.");
    expect(result?.slug).toBe("how-i-grade");
  });

  it("applies linkReviewedWorks to produce final content HTML", () => {
    const result = getPage("how-i-grade", pageFixtures, reviewDataFixtures);
    expect(result?.content).toContain(
      '<a href="/reviews/linked-work/">Linked Work</a>',
    );
  });

  it("converts unreviewed work spans to plain text (no link)", () => {
    const result = getPage("how-i-grade", pageFixtures, reviewDataFixtures);
    expect(result?.content).toContain("Unreviewed Work");
    expect(result?.content).not.toContain('data-work-slug="unreviewed-work"');
  });

  it("passes intermediateHtml through to the content field", () => {
    const result = getPage("how-i-grade", pageFixtures, reviewDataFixtures);
    // intermediateHtml is stored in the result but content is the linked version
    expect(result?.content).not.toContain('data-work-slug="linked-work"');
  });
});

describe("getContentPlainText", () => {
  it("strips markdown formatting to plain text", () => {
    const result = getContentPlainText("**Bold** and _italic_ text.");
    expect(result.trim()).toBe("Bold and italic text.");
  });

  it("removes footnotes", () => {
    const result = getContentPlainText(
      "Text with[^1] footnote.\n\n[^1]: Footnote content.",
    );
    expect(result.trim()).not.toContain("[^1]");
    expect(result.trim()).not.toContain("Footnote content");
  });
});
