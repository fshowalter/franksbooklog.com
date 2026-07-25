import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "vitest";

import { CONTENT_ROOT } from "~/collections/contentRoot";

import { renderMarkdown } from "./renderMarkdown";

/**
 * AIDEV-NOTE: Compensating controls for things the remark pipeline used to hide.
 *
 * remark-smartypants decided each quote's direction from the characters around
 * it, one text node at a time, so a mistyped quote in the source still came out
 * looking plausible. Sätteri pairs quotes across inline elements with a real
 * open/close state machine, so the same mistake now renders a quote pointing the
 * wrong way — visible, but easy to miss by eye across 286 files.
 *
 * The two checks below catch different failure modes and are both cheap.
 */

const MARKDOWN_DIRECTORIES = ["pages", "readings", "reviews"];
const SMART_QUOTE = /[‘’“”]/u;

const OPEN = "“";
const CLOSE = "”";
/** Rendered blocks that can hold a complete quotation. */
const BLOCK_END = /<\/(?:h[1-6]|li|p)>/;

describe("content integrity", () => {
  /**
   * Frank only ever types ' and ", and lets smart punctuation choose the glyph.
   * So any curly quote in the source arrived by copy/paste — and when this check
   * was introduced it found five that were simply wrong: `There‘s`, `it‘s`,
   * `‘63`, `‘er`, and `‘Salem’s Lot` all had an opening quote where an apostrophe
   * belonged. Straight quotes render correctly in every one of those positions.
   */
  it("contains no smart quotes in the markdown source", ({ expect }) => {
    const offenders: string[] = [];

    for (const { id, source } of readMarkdownFiles()) {
      for (const [index, line] of source.split("\n").entries()) {
        if (SMART_QUOTE.test(line)) {
          offenders.push(`${id}:${index + 1}  ${summarize(line)}`);
        }
      }
    }

    expect(offenders).toStrictEqual([]);
  });

  /**
   * Straight quotes in the source do not guarantee balanced quotes in the output
   * — a quotation missing its closing " still renders as an unclosed “. This
   * catches that, which the source check above cannot see.
   *
   * Tuned to stay quiet: nesting is allowed, and only double quotes are checked
   * (single curly quotes are indistinguishable from apostrophes). Each rendered
   * block stands alone, so a quotation spanning paragraphs would be reported;
   * nothing in content does that.
   */
  it("closes every double quote it opens", ({ expect }) => {
    const offenders: string[] = [];

    for (const { id, source } of readMarkdownFiles()) {
      for (const block of renderMarkdown(source).split(BLOCK_END)) {
        const text = block.replaceAll(/<[^>]*>/g, "");
        const problem = findQuoteProblem(text);

        if (problem) {
          offenders.push(`${id} [${problem}]\n    ${summarize(text)}`);
        }
      }
    }

    expect(offenders).toStrictEqual([]);
  });
});

function findQuoteProblem(text: string): string | undefined {
  let depth = 0;

  for (const character of text) {
    if (character === OPEN) {
      depth++;
    } else if (character === CLOSE) {
      depth--;

      if (depth < 0) {
        return "closing quote before any opening quote";
      }
    }
  }

  return depth > 0 ? `${depth} unclosed opening quote(s)` : undefined;
}

function readMarkdownFiles(): { id: string; source: string }[] {
  return MARKDOWN_DIRECTORIES.flatMap((directory) => {
    const directoryPath = path.join(CONTENT_ROOT, directory);

    return readdirSync(directoryPath)
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({
        id: `${directory}/${name}`,
        source: readFileSync(path.join(directoryPath, name), "utf8"),
      }));
  });
}

function summarize(text: string): string {
  return text.trim().replaceAll(/\s+/g, " ").slice(0, 150);
}
