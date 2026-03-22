import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

import { CONTENT_ROOT } from "./contentRoot";
import { getBaseMarkdownProcessor } from "./utils/getBaseMarkdownProcessor";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";
import { removeFootnotes } from "./utils/markdown-plugins/removeFootnotes";
import { trimToExcerpt } from "./utils/markdown-plugins/trimToExcerpt";
import { markdownToDescription } from "./utils/markdownToDescription";
import { markdownToHtml } from "./utils/markdownToHtml";

function parseExcerpt(frontmatter: Record<string, unknown>, body: string) {
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

const ReviewSchema = z.object({
  body: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  excerptHtml: z.string(),
  grade: z.string(),
  html: z.string(),
  slug: z.string(),
  synopsis: z.optional(z.string()),
  work: reference("reviewedWorks"),
});

export const reviews = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ body, frontmatter }) => {
          const excerptHtml = parseExcerpt(frontmatter, body);

          return {
            body,
            date: frontmatter.date,
            description: markdownToDescription(body),
            excerptHtml,
            grade: frontmatter.grade as string,
            html: markdownToHtml(body),
            slug: frontmatter.slug as string,
            synopsis: frontmatter.synopsis as string | undefined,
            work: frontmatter.slug as string,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "reviews"),
        loaderContext,
      }),
    name: "reviews-loader",
  },
  schema: ReviewSchema,
});
