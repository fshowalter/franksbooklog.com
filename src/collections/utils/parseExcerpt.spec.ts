import { describe, it } from "vitest";

import { parseExcerpt } from "./parseExcerpt";

describe("parseExcerpt", () => {
  describe("source selection", () => {
    it("uses the body when there is no synopsis", ({ expect }) => {
      expect(parseExcerpt({}, "Body para.\n\nMore.")).toBe("<p>Body para.</p>");
    });

    it("prefers a non-blank synopsis over the body", ({ expect }) => {
      expect(parseExcerpt({ synopsis: "A synopsis." }, "Body para.")).toBe(
        "<p>A synopsis.</p>",
      );
    });

    it("falls back to the body when the synopsis is whitespace only", ({
      expect,
    }) => {
      expect(parseExcerpt({ synopsis: " ".repeat(3) }, "Body para.")).toBe(
        "<p>Body para.</p>",
      );
    });

    it("applies smart punctuation to synopsis text", ({ expect }) => {
      expect(parseExcerpt({ synopsis: "cabin--and more." }, "body")).toBe(
        "<p>cabin—and more.</p>",
      );
    });
  });

  describe("trimming", () => {
    it("keeps only the first paragraph", ({ expect }) => {
      expect(parseExcerpt({}, "First para.\n\nSecond para.\n\nThird.")).toBe(
        "<p>First para.</p>",
      );
    });

    // AIDEV-NOTE: the trim is "everything after the first paragraph", so blocks
    // that appear BEFORE the first paragraph survive. 54 content files carry an
    // inert `<!-- end -->` marker that no code reads — the trim is positional.
    it("keeps blocks that precede the first paragraph", ({ expect }) => {
      expect(parseExcerpt({}, "## Head\n\nFirst para.\n\nSecond.")).toBe(
        "<h2>Head</h2>\n<p>First para.</p>",
      );
    });

    it("drops an end marker that follows the first paragraph", ({ expect }) => {
      expect(parseExcerpt({}, "First para.\n\n<!-- end -->\n\nSecond.")).toBe(
        "<p>First para.</p>",
      );
    });
  });

  describe("footnotes", () => {
    it("removes a footnote reference and emits no footnote section", ({
      expect,
    }) => {
      expect(
        parseExcerpt({}, "First[^1] para.\n\nSecond.\n\n[^1]: note."),
      ).toBe("<p>First para.</p>");
    });
  });

  describe("raw HTML", () => {
    it("preserves a data-title-id span", ({ expect }) => {
      expect(
        parseExcerpt(
          {},
          'A <span data-title-id="x">"T"</span> ref.\n\nSecond.',
        ),
      ).toBe('<p>A <span data-title-id="x">“T”</span> ref.</p>');
    });
  });
});
