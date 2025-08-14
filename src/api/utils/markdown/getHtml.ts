import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";

import { linkReviewedWorks } from "~/api/utils/linkReviewedWorks";
import { remarkPullQuotes } from "~/api/utils/markdown/remarkPullQuotes";

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
    .use(remarkPullQuotes)
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
