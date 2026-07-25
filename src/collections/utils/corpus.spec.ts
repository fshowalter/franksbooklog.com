import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import { CONTENT_ROOT } from "~/collections/contentRoot";

import { markdownToDescription } from "./markdownToDescription";
import { markdownToHtml } from "./markdownToHtml";
import { parseExcerpt } from "./parseExcerpt";
import { parseFrontmatter } from "./parseFrontmatter";
import { toInlineSpanHtml } from "./toInlineSpanHtml";

// AIDEV-NOTE: Golden snapshots of real content rendered through every pipeline.
// Hand-written unit tests state the contract; this states "and nothing else moved".
// It is the widest net we have for the Sätteri migration — a diff here during the
// engine swap must be explained before it is accepted.
//
// Snapshots live in ./__snapshots__ and are excluded from Prettier, which would
// otherwise reformat the HTML and desync them.

// The five reviews that use footnotes, plus one with heavy raw-HTML cross-references.
const REVIEWS = [
  "behold-the-void-by-philip-fracassi",
  "carrie-by-stephen-king",
  "ghost-story-by-peter-straub",
  "live-and-let-die-by-ian-fleming",
  "salems-lot-by-stephen-king",
  "the-big-sleep-by-raymond-chandler",
  "the-shining-by-stephen-king",
];

function readContent(relativePath: string): string {
  return readFileSync(path.join(CONTENT_ROOT, relativePath), "utf8");
}

describe("content corpus", () => {
  describe("reviews", () => {
    for (const slug of REVIEWS) {
      it(`renders ${slug}`, async ({ expect }) => {
        const source = readContent(path.join("reviews", `${slug}.md`));
        const { body, frontmatter } = parseFrontmatter(source, `${slug}.md`);

        const rendered = [
          "=== html ===",
          markdownToHtml(body),
          "",
          "=== excerptHtml ===",
          parseExcerpt(frontmatter, body),
          "",
          "=== description ===",
          markdownToDescription(body),
        ].join("\n");

        await expect(rendered).toMatchFileSnapshot(
          `./__snapshots__/review-${slug}.txt`,
        );
      });
    }
  });

  describe("pages", () => {
    it("renders how-i-grade", async ({ expect }) => {
      const source = readContent(path.join("pages", "how-i-grade.md"));
      const { body } = parseFrontmatter(source, "how-i-grade.md");

      const rendered = [
        "=== html ===",
        markdownToHtml(body),
        "",
        "=== description ===",
        markdownToDescription(body),
      ].join("\n");

      await expect(rendered).toMatchFileSnapshot(
        "./__snapshots__/page-how-i-grade.txt",
      );
    });
  });

  describe("readings", () => {
    it("renders edition notes inline", async ({ expect }) => {
      const source = readContent(
        path.join("readings", "2011-11-06-01-the-shining-by-stephen-king.md"),
      );
      const { frontmatter } = parseFrontmatter(source, "a-reading.md");

      await expect(
        toInlineSpanHtml(frontmatter.editionNotes as string),
      ).toMatchFileSnapshot("./__snapshots__/reading-edition-notes.txt");
    });
  });
});
