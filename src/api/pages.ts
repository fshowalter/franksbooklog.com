import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import type { PageData, ReviewedWorkData } from "~/content.config";

import { linkReviewedWorks } from "./utils/linkReviewedWorks";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";

// AIDEV-NOTE: getPage is now a pure synchronous function. The remark/rehype pipeline
// runs in the content loader (see content.config.ts pages collection); linkReviewedWorks
// runs here at build time with the live reviewedWorks array.
// getContentPlainText remains a pure utility — signature unchanged.

/**
 * Converts markdown content to plain text by stripping all formatting.
 * Removes footnotes, markdown syntax, and HTML to produce clean text
 * suitable for meta descriptions or text-only contexts.
 *
 * @param rawContent - Raw markdown content to convert
 * @returns Plain text version of the content
 */
export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

/**
 * Retrieves and processes a specific page by slug.
 * Applies linkReviewedWorks to the pre-computed intermediate HTML from the
 * content store to produce final HTML with reviewed work spans linked.
 *
 * @param slug - The unique slug identifier for the page
 * @param pages - Pre-fetched pages collection data
 * @param reviewedWorks - Pre-fetched reviewed works collection data (for linking)
 * @returns Processed page data with final HTML content, or undefined if not found
 */
export function getPage(
  slug: string,
  pages: PageData[],
  reviewedWorks: ReviewedWorkData[],
): (PageData & { content: string }) | undefined {
  const page = pages.find((p) => p.slug === slug);
  if (!page) return undefined;
  return {
    ...page,
    content: linkReviewedWorks(page.intermediateHtml, reviewedWorks),
  };
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
