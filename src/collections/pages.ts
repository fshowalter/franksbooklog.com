import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { renderMarkdown, renderPlainText } from "markdown-utils";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";

const PageSchema = z.object({
  description: z.string(),
  html: z.string(),
  slug: z.string(),
  title: z.string(),
});

export const pages = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ frontmatter, source }) => {
          return {
            description: renderPlainText(source),
            html: renderMarkdown(source),
            slug: frontmatter.slug,
            title: frontmatter.title,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "pages"),
        loaderContext,
      }),
    name: "pages-loader",
  },
  schema: PageSchema,
});
