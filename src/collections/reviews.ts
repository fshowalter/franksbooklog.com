import type { LoaderContext } from "astro/loaders";

import { defineCollection, reference, z } from "astro:content";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

import { removeFootnotes } from "~/utils/markdown/removeFootnotes";
import { trimToExcerpt } from "~/utils/markdown/trimToExcerpt";

import { CONTENT_ROOT } from "./contentRoot";
import { getBaseMarkdownProcessor } from "./utils/getBaseMarkdownProcessor";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";
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

// AIDEV-NOTE: slug references the 'works' collection — parseData() coerces the plain
// frontmatter string to { collection: "works", id } automatically.
const ReviewSchema = z.object({
  body: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  excerptHtml: z.string(),
  excerptPlainText: z.string(),
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
          const excerptContent =
            (frontmatter.synopsis as string | undefined)?.trim() || body;

          return {
            body,
            date: frontmatter.date,
            description: markdownToDescription(body),
            excerptHtml: parseExcerpt(frontmatter, body),
            excerptPlainText: excerptContent,
            grade: frontmatter.grade as string,
            html: markdownToHtml(body),
            more: frontmatter.slug,
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
