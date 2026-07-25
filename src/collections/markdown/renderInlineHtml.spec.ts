import { describe, it } from "vitest";

import { renderInlineHtml } from "./renderInlineHtml";

// Used for readings.editionNotesHtml, which is dropped into an inline
// <span class="rendered-markdown"> in ReadingHistory.astro — a <p> there would
// break the layout.

describe("renderInlineHtml", () => {
  it("renders a single paragraph as a span", ({ expect }) => {
    expect(renderInlineHtml("New American Library, 1986")).toBe(
      "<span>New American Library, 1986</span>",
    );
  });

  it("keeps inline markup inside the span", ({ expect }) => {
    expect(renderInlineHtml("Read _Dracula_ here")).toBe(
      "<span>Read <em>Dracula</em> here</span>",
    );
  });

  it("keeps a raw span inside the wrapper", ({ expect }) => {
    expect(
      renderInlineHtml('Notes <span data-title-id="t">"T"</span> end'),
    ).toBe('<span>Notes <span data-title-id="t">“T”</span> end</span>');
  });

  it("only retags the first block, leaving later ones as paragraphs", ({
    expect,
  }) => {
    expect(renderInlineHtml("first\n\nsecond")).toBe(
      "<span>first</span>\n<p>second</p>",
    );
  });

  // AIDEV-NOTE: Deliberate narrowing. The remark implementation retagged
  // `tree.children[0]` whatever it was, so a leading heading, list, or blockquote
  // also became a <span> — which produced invalid markup like `<span><li>`. This
  // version only retags a leading paragraph. Every edition note in content is a
  // single short line, so no real input reaches the difference.
  it("leaves a leading heading as a heading", ({ expect }) => {
    expect(renderInlineHtml("## Head")).toBe("<h2>Head</h2>");
  });

  it("leaves a leading list alone", ({ expect }) => {
    expect(renderInlineHtml("- one\n- two")).toBe(
      "<ul>\n<li>one</li>\n<li>two</li>\n</ul>",
    );
  });

  it("returns an empty string for empty input", ({ expect }) => {
    expect(renderInlineHtml("")).toBe("");
  });

  it("returns an empty string for whitespace-only input", ({ expect }) => {
    expect(renderInlineHtml(" ".repeat(3))).toBe("");
  });
});
