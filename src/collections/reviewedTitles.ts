import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { GRADE_TO_VALUE, GRADES, gradeToValue } from "~/utils/grades";

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
    grade: z.enum(GRADES),
    gradeValue: z.literal(Object.values(GRADE_TO_VALUE)),
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
      gradeValue,
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
        gradeValue,
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

const ReviewTitleGradeSchema = z.object({
  grade: z.enum(GRADES),
});

export const reviewedTitles = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        buildData: ({ raw }) => {
          const { grade } = ReviewTitleGradeSchema.parse(raw);

          raw["gradeValue"] = gradeToValue(grade);

          return raw;
        },
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-titles"),
        loaderContext,
      }),
    name: "reviewed-titles-loader",
  },
  schema: ReviewedTitleSchema,
});
