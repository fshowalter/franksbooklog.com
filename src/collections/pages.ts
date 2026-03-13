import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";
import { markdownToDescription } from "./utils/markdownToDescription";
import { markdownToHtml } from "./utils/markdownToHtml";

const PageSchema = z.object({
  body: z.string(),
  description: z.string(),
  html: z.string(),
  slug: z.string(),
  title: z.string(),
});

export const pages = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ body, frontmatter }) => {
          return {
            body,
            description: markdownToDescription(body),
            html: markdownToHtml(body),
            slug: frontmatter.slug as string,
            title: frontmatter.title as string,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "pages"),
        loaderContext,
      }),
    name: "pages-loader",
  },
  schema: PageSchema,
});
