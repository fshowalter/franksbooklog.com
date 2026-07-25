import { describe, it } from "vitest";

import { toInlineSpanHtml } from "./toInlineSpanHtml";

// Used for readings.editionNotesHtml, which is dropped into an inline
// <span class="rendered-markdown"> in ReadingHistory.astro — a <p> there would
// break the layout.

describe("toInlineSpanHtml", () => {
  it("renders a single paragraph as a span", ({ expect }) => {
    expect(toInlineSpanHtml("New American Library, 1986")).toBe(
      "<span>New American Library, 1986</span>",
    );
  });

  it("keeps inline markup inside the span", ({ expect }) => {
    expect(toInlineSpanHtml("Read _Dracula_ here")).toBe(
      "<span>Read <em>Dracula</em> here</span>",
    );
  });

  it("only retags the first block, leaving later ones as paragraphs", ({
    expect,
  }) => {
    expect(toInlineSpanHtml("first\n\nsecond")).toBe(
      "<span>first</span>\n<p>second</p>",
    );
  });

  it("returns an empty string for empty input", ({ expect }) => {
    expect(toInlineSpanHtml("")).toBe("");
  });

  it("returns an empty string for whitespace-only input", ({ expect }) => {
    expect(toInlineSpanHtml(" ".repeat(3))).toBe("");
  });
});
