import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import type { MarkdownPage as RawMarkdownPage } from "./data/pages-markdown";

import { allPagesMarkdown } from "./data/pages-markdown";
import {
  allReviewedWorksJson,
  type ReviewedWorkJson,
} from "./data/reviewed-works-json";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";

let cachedPagesMarkdown: RawMarkdownPage[];
let cachedReviewedWorksJson: ReviewedWorkJson[];

/**
 * Type representing a processed Markdown page with rendered content.
 * Contains both the raw markdown and the processed HTML output.
 */
type MarkdownPage = {
  content: string | undefined;
  rawContent: string;
  title: string;
};

/**
 * Converts markdown content to plain text by stripping all formatting.
 * Removes footnotes, markdown syntax, and HTML to produce clean text
 * suitable for meta descriptions or text-only contexts.
 *
 * @param rawContent - Raw markdown content to convert
 * @returns Plain text version of the content
 *
 * @example
 * ```typescript
 * const plainText = getContentPlainText('**Bold** text with [link](url)');
 * console.log(plainText); // 'Bold text with link'
 * ```
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
 * Loads the page markdown, processes it to HTML with linked works,
 * and returns both raw and processed content with caching.
 *
 * @param slug - The unique slug identifier for the page
 * @returns Promise resolving to processed page data with HTML content
 *
 * @example
 * ```typescript
 * const aboutPage = await getPage('about');
 * console.log(aboutPage.title); // Page title
 * console.log(aboutPage.content); // Processed HTML with linked works
 * console.log(aboutPage.rawContent); // Original markdown
 * ```
 */
export async function getPage(slug: string): Promise<MarkdownPage> {
  return await perfLogger.measure("getPage", async () => {
    const pages = cachedPagesMarkdown || (await allPagesMarkdown());
    if (ENABLE_CACHE && !cachedPagesMarkdown) {
      cachedPagesMarkdown = pages;
    }

    const matchingPage = pages.find((page) => {
      return page.slug === slug;
    })!;

    const reviewedWorksJson =
      cachedReviewedWorksJson || (await allReviewedWorksJson());
    if (ENABLE_CACHE && !cachedReviewedWorksJson) {
      cachedReviewedWorksJson = reviewedWorksJson;
    }

    return {
      content: getHtml(matchingPage.rawContent, reviewedWorksJson),
      rawContent: matchingPage?.rawContent || "",
      title: matchingPage.title,
    };
  });
}

/**
 * Internal function to create a configured remark processor.
 * Includes GitHub Flavored Markdown and smart typography processing.
 *
 * @returns Configured remark processor instance
 */
function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
