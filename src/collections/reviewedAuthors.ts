import type { LoaderContext } from "astro/loaders";

import { defineCollection, z } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";

const ReviewedAuthorWorkAuthorSchema = z
  .object({
    name: z.string(),
    notes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    slug: z.string(),
    sortName: z.string(),
  })
  .transform(({ name, notes, slug, sortName }) => {
    // fix zod making anything with undefined optional
    return { name, notes, slug, sortName };
  });

const ReviewedAuthorWorkSchema = z.object({
  authors: z.array(ReviewedAuthorWorkAuthorSchema),
  grade: z.string(),
  id: z.string(),
  kind: z.string(),
  reviewDate: z.coerce.date(),
  reviewSequence: z.string(),
  reviewSlug: z.string(),
  sortTitle: z.string(),
  title: z.string(),
  workYear: z.string(),
});

const ReviewedAuthorSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(ReviewedAuthorWorkSchema),
  slug: z.string(),
  sortName: z.string(),
});

export const reviewedAuthors = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-authors"),
        getId: (raw) => raw.slug as string,
        loaderContext,
      }),
    name: "reviewed-authors-loader",
  },
  schema: ReviewedAuthorSchema,
});
