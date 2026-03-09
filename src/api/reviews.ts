import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { removeFootnotes } from "./utils/markdown/removeFootnotes";

/**
 * Converts raw markdown content to plain text by removing footnotes and markdown formatting.
 * Used for generating excerpt text and search indexing.
 *
 * @param rawContent - The raw markdown content to process
 * @returns Plain text version of the content
 */
export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
