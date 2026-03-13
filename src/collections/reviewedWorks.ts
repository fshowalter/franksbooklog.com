import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";

const ReviewedWorkAuthorSchema = z
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

const MoreByAuthorSchema = z.object({
  author: z.string(),
  reviews: z.array(reference("reviewedWorks")),
});

const ReviewedWorkSchema = z
  .object({
    authors: z.array(ReviewedWorkAuthorSchema),
    grade: z.string(),
    id: z.string(),
    includedInWorks: z.array(reference("reviewedWorks")),
    includedWorks: z.array(reference("reviewedWorks")),
    kind: z.string(),
    moreByAuthors: z.array(MoreByAuthorSchema),
    moreReviews: z.array(reference("reviewedWorks")),
    review: reference("reviews"),
    reviewDate: z.coerce.date(),
    reviewSequence: z.string(),
    sortTitle: z.string(),
    subtitle: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
    workYear: z.string(),
  })
  .transform(
    ({
      authors,
      grade,
      id,
      includedInWorks,
      includedWorks,
      kind,
      moreByAuthors,
      moreReviews,
      review,
      reviewDate,
      reviewSequence,
      sortTitle,
      subtitle,
      title,
      workYear,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        grade,
        id,
        includedInWorks,
        includedWorks,
        kind,
        moreByAuthors,
        moreReviews,
        review,
        reviewDate,
        reviewSequence,
        sortTitle,
        subtitle,
        title,
        workYear,
      };
    },
  );

export const reviewedWorks = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-works"),
        loaderContext,
      }),
    name: "reviewed-works-loader",
  },
  schema: ReviewedWorkSchema,
});
