import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import { describe, it } from "vitest";

import { remarkPullQuotes } from "./remarkPullQuotes";

function processMarkdown(markdown: string): string {
  return remark()
    .use(remarkPullQuotes)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(markdown)
    .toString();
}

describe("remarkPullQuotes", () => {
  it("converts {pullquote} marker to pull-quote class", ({ expect }) => {
    const markdown = `> {pullquote} This is a memorable quote from the book.`;
    const result = processMarkdown(markdown);

    expect(result).toMatchSnapshot();
  });

  it("removes the marker but preserves quote content", ({ expect }) => {
    const markdown = `> {pullquote} An organization does well only those things the Boss checks.`;
    const result = processMarkdown(markdown);

    expect(result).toMatchSnapshot();
  });

  it("leaves regular blockquotes unchanged", ({ expect }) => {
    const markdown = `> This is a regular blockquote without the marker.`;
    const result = processMarkdown(markdown);

    expect(result).toMatchSnapshot();
  });

  it("handles empty pullquote marker", ({ expect }) => {
    const markdown = `> {pullquote}`;
    const result = processMarkdown(markdown);

    expect(result).toMatchSnapshot();
  });
});
