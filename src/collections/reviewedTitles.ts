import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";

const ReviewedTitleAuthorSchema = z
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
  reviews: z.array(reference("reviewedTitles")),
});

const ReviewedTitleSchema = z
  .object({
    authors: z.array(ReviewedTitleAuthorSchema),
    grade: z.string(),
    id: z.string(),
    includedInTitles: z.array(reference("reviewedTitles")),
    includedTitles: z.array(reference("reviewedTitles")),
    kind: z.string(),
    moreByAuthors: z.array(MoreByAuthorSchema),
    moreReviews: z.array(reference("reviewedTitles")),
    review: reference("reviews"),
    reviewDate: z.coerce.date(),
    reviewSequence: z.string(),
    sortTitle: z.string(),
    subtitle: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
    titleYear: z.string(),
  })
  .transform(
    ({
      authors,
      grade,
      id,
      includedInTitles,
      includedTitles,
      kind,
      moreByAuthors,
      moreReviews,
      review,
      reviewDate,
      reviewSequence,
      sortTitle,
      subtitle,
      title,
      titleYear,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        grade,
        id,
        includedInTitles,
        includedTitles,
        kind,
        moreByAuthors,
        moreReviews,
        review,
        reviewDate,
        reviewSequence,
        sortTitle,
        subtitle,
        title,
        titleYear,
      };
    },
  );

export const reviewedTitles = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-titles"),
        loaderContext,
      }),
    name: "reviewed-titles-loader",
  },
  schema: ReviewedTitleSchema,
});
