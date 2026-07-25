import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

import { getBaseMarkdownProcessor } from "./getBaseMarkdownProcessor";
import { removeFootnotes } from "./markdown-plugins/removeFootnotes";
import { trimToExcerpt } from "./markdown-plugins/trimToExcerpt";

/** Excerpt HTML pipeline — footnotes stripped, trimmed to the first paragraph.
 *  A non-blank `synopsis` frontmatter entry wins over the body. */
export function parseExcerpt(
  frontmatter: Record<string, unknown>,
  body: string,
): string {
  const excerptContent =
    (frontmatter.synopsis as string | undefined)?.trim() || body;

  //trim the string to the maximum length
  return getBaseMarkdownProcessor()
    .use(removeFootnotes)
    .use(trimToExcerpt)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(excerptContent)
    .toString();
}
