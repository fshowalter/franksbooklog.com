import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";

import { linkReviewedWorks } from "~/api/utils/linkReviewedWorks";

/**
 * Converts markdown content to HTML with enhanced processing.
 * Uses a complete markdown-to-HTML pipeline including GitHub Flavored Markdown,
 * smart typography, footnote support, and automatic linking of reviewed works.
 *
 * @param content - Markdown content to process, may be undefined
 * @param reviewedWorks - Array of reviewed works for automatic linking
 * @returns Processed HTML string with enhanced features, or undefined if no content
 */
export function getHtml(
  content: string | undefined,
  reviewedWorks: { slug: string }[],
) {
  if (!content) {
    return;
  }

  const html = remark()
    .use(remarkGfm)
    .use(smartypants)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      footnoteBackContent: "↩\u{FE0E}",
    })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(content)
    .toString();

  return linkReviewedWorks(html, reviewedWorks);
}
