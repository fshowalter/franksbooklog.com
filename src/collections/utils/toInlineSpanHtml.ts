import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

import { getBaseMarkdownProcessor } from "./getBaseMarkdownProcessor";
import { rootAsSpan } from "./markdown-plugins/rootAsSpan";

/** Inline span HTML pipeline — wraps in <span>, no linkReviewedWorks */
export function toInlineSpanHtml(content: string): string {
  return getBaseMarkdownProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(content)
    .toString();
}
