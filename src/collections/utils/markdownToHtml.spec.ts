import { describe, it } from "vitest";

import { markdownToHtml } from "./markdownToHtml";

// AIDEV-NOTE: These are acceptance tests for the markdown pipeline, written against
// the remark/rehype implementation before the Sätteri migration. Expectations were
// measured from the live pipeline, not guessed. When the engine is swapped, any
// expectation that changes must be changed deliberately, in its own commit.

describe("markdownToHtml", () => {
  describe("block rendering", () => {
    it("renders emphasis and strong inside a paragraph", ({ expect }) => {
      expect(markdownToHtml("Hello *world* and **bold**.")).toBe(
        "<p>Hello <em>world</em> and <strong>bold</strong>.</p>",
      );
    });

    it("renders separate paragraphs", ({ expect }) => {
      expect(markdownToHtml("One.\n\nTwo.")).toBe("<p>One.</p>\n<p>Two.</p>");
    });

    it("renders a heading", ({ expect }) => {
      expect(markdownToHtml("## Head")).toBe("<h2>Head</h2>");
    });

    it("renders a blockquote", ({ expect }) => {
      expect(markdownToHtml("> quoted")).toBe(
        "<blockquote>\n<p>quoted</p>\n</blockquote>",
      );
    });

    it("renders a thematic break between paragraphs", ({ expect }) => {
      expect(markdownToHtml("a\n\n---\n\nb")).toBe("<p>a</p>\n<hr>\n<p>b</p>");
    });

    it("renders a nested list", ({ expect }) => {
      expect(markdownToHtml("- one\n  - inner\n- two")).toBe(
        "<ul>\n<li>one\n<ul>\n<li>inner</li>\n</ul>\n</li>\n<li>two</li>\n</ul>",
      );
    });

    it("renders an image", ({ expect }) => {
      expect(markdownToHtml("![alt](/svg/5-stars.svg)")).toBe(
        '<p><img src="/svg/5-stars.svg" alt="alt"></p>',
      );
    });

    it("returns an empty string for empty input", ({ expect }) => {
      expect(markdownToHtml("")).toBe("");
    });
  });

  describe("raw HTML passthrough", () => {
    // linkReviewedTitles regexes these spans out of the stored HTML later, so the
    // attribute and inner text must survive byte-for-byte.
    it("preserves a data-title-id span", ({ expect }) => {
      expect(
        markdownToHtml(
          'An <span data-title-id="altar-by-philip-fracassi">"Altar"</span> ref.',
        ),
      ).toBe(
        '<p>An <span data-title-id="altar-by-philip-fracassi">“Altar”</span> ref.</p>',
      );
    });

    it("preserves a data-imdb-id span and renders markdown inside it", ({
      expect,
    }) => {
      expect(
        markdownToHtml(
          'See <span data-imdb-id="tt0105236">_Reservoir Dogs_</span>.',
        ),
      ).toBe(
        '<p>See <span data-imdb-id="tt0105236"><em>Reservoir Dogs</em></span>.</p>',
      );
    });

    it("preserves a br tag", ({ expect }) => {
      expect(markdownToHtml("line one<br>line two")).toBe(
        "<p>line one<br>line two</p>",
      );
    });
  });

  describe("smart punctuation", () => {
    it("curls double quotes and apostrophes", ({ expect }) => {
      expect(markdownToHtml(`He said "hello" and it's fine.`)).toBe(
        "<p>He said “hello” and it’s fine.</p>",
      );
    });

    it("pairs quotes across an inline element", ({ expect }) => {
      expect(markdownToHtml(`"*Emphasized* quote"`)).toBe(
        "<p>“<em>Emphasized</em> quote”</p>",
      );
    });

    it("converts three dots to an ellipsis", ({ expect }) => {
      expect(markdownToHtml("Wait... really?")).toBe("<p>Wait… really?</p>");
    });

    // AIDEV-NOTE: 66 content files use `--` as an em dash. remark-smartypants'
    // `dashes: true` maps `--` to an em dash and leaves `---` ALONE. Sätteri's
    // native smartPunctuation would map `--` to an EN dash, so it is disabled
    // there in favour of a custom plugin. These three cases are the contract.
    it("converts a double dash to an em dash", ({ expect }) => {
      expect(markdownToHtml("a--b")).toBe("<p>a—b</p>");
    });

    it("leaves a triple dash alone", ({ expect }) => {
      expect(markdownToHtml("c---d")).toBe("<p>c---d</p>");
    });

    it("leaves a spaced single dash alone", ({ expect }) => {
      expect(markdownToHtml("e - f")).toBe("<p>e - f</p>");
    });

    it("does not touch punctuation inside inline code", ({ expect }) => {
      expect(markdownToHtml('use `a--b` and `"x"` here')).toBe(
        '<p>use <code>a--b</code> and <code>"x"</code> here</p>',
      );
    });
  });

  describe("footnotes", () => {
    // The classes and ids asserted here are styled by name in src/css/tailwind.css
    // (.footnotes, .footnotes h2, .data-footnote-backref, sup a). Changing them
    // silently breaks the footnote styling.
    it("renders a reference and the footnote section", ({ expect }) => {
      expect(markdownToHtml("Text[^1].\n\n[^1]: The note.")).toBe(
        '<p>Text<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref="" aria-describedby="footnote-label">1</a></sup>.</p>\n' +
          '<section data-footnotes="" class="footnotes"><h2 class="sr-only" id="footnote-label">Footnotes</h2>\n' +
          "<ol>\n" +
          '<li id="user-content-fn-1">\n' +
          '<p>The note. <a href="#user-content-fnref-1" data-footnote-backref="" aria-label="Back to reference 1" class="data-footnote-backref">↩︎</a></p>\n' +
          "</li>\n" +
          "</ol>\n" +
          "</section>",
      );
    });

    it("uses the configured backref content", ({ expect }) => {
      // U+FE0E forces the text presentation of the arrow rather than an emoji.
      expect(markdownToHtml("Text[^1].\n\n[^1]: The note.")).toContain(
        ">↩\u{FE0E}</a>",
      );
    });

    it("hides the footnotes heading from sighted readers", ({ expect }) => {
      expect(markdownToHtml("Text[^1].\n\n[^1]: The note.")).toContain(
        '<h2 class="sr-only" id="footnote-label">Footnotes</h2>',
      );
    });

    // content/reviews/live-and-let-die-by-ian-fleming.md relies on this.
    it("renders nothing for a footnote definition with no reference", ({
      expect,
    }) => {
      expect(markdownToHtml("No ref.\n\n[^1]: Orphan.")).toBe("<p>No ref.</p>");
    });
  });
});
