import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { GRADE_VALUES, GRADES, gradeToValue } from "~/utils/grades";

import { CONTENT_ROOT } from "./contentRoot";
import { loadMarkdownDirectory } from "./utils/loadMarkdownDirectory";
import { markdownToDescription } from "./utils/markdownToDescription";
import { markdownToHtml } from "./utils/markdownToHtml";
import { parseExcerpt } from "./utils/parseExcerpt";

const ReviewFrontmatterSchema = z.object({
  grade: z.enum(GRADES),
});

const ReviewSchema = z.object({
  body: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  excerptHtml: z.string(),
  grade: z.enum(GRADES),
  gradeValue: z.literal(GRADE_VALUES),
  html: z.string(),
  slug: z.string(),
  synopsis: z.optional(z.string()),
  work: reference("reviewedTitles"),
});

export const reviews = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadMarkdownDirectory({
        buildData: ({ body, frontmatter }) => {
          const excerptHtml = parseExcerpt(frontmatter, body);
          const { grade } = ReviewFrontmatterSchema.parse(frontmatter);
          return {
            body,
            date: frontmatter.date,
            description: markdownToDescription(body),
            excerptHtml,
            grade: grade,
            gradeValue: gradeToValue(grade),
            html: markdownToHtml(body),
            slug: frontmatter.slug,
            synopsis: frontmatter.synopsis,
            work: frontmatter.slug,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "reviews"),
        loaderContext,
      }),
    name: "reviews-loader",
  },
  schema: ReviewSchema,
});
