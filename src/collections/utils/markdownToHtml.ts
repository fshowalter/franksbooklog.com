import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

import { getBaseMarkdownProcessor } from "./getBaseMarkdownProcessor";

/** Full block HTML pipeline — spans intact, linkReviewedWorks not applied */
export function markdownToHtml(markdown: string): string {
  return getBaseMarkdownProcessor()
    .use(remarkRehype, {
      allowDangerousHtml: true,
      footnoteBackContent: "↩\uFE0E",
    })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(markdown)
    .toString();
}
