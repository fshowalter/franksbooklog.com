import strip from "strip-markdown";

import { getBaseMarkdownProcessor } from "./getBaseMarkdownProcessor";
import { removeFootnotes } from "./markdown-plugins/removeFootnotes";

/**
 * Converts raw markdown content to plain text by removing footnotes and markdown formatting.
 * Used for generating excerpt text and search indexing.
 *
 * @param rawContent - The raw markdown content to process
 * @returns Plain text version of the content
 */
export function markdownToPlainText(markdown: string): string {
  return getBaseMarkdownProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(markdown)
    .toString();
}
