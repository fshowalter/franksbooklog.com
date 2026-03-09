import { reference, z } from "astro:content";

const DistributionSchema = z.object({
  count: z.number(),
  name: z.string(),
});

const GradeDistributionSchema = DistributionSchema.extend({
  sortValue: z.number(),
});

const MostReadAuthorWorkSchema = z
  .object({
    edition: z.string(),
    readingDate: z.coerce.date(),
    reviewSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
  })
  .transform(({ edition, readingDate, reviewSlug, title }) => {
    // fix zod making anything with undefined optional
    return { edition, readingDate, reviewSlug, title };
  });

const MostReadAuthorSchema = z
  .object({
    count: z.number(),
    name: z.string(),
    readWorks: z.array(MostReadAuthorWorkSchema),
    reviewed: z.boolean(),
    slug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
  })
  .transform(({ count, name, readWorks, reviewed, slug }) => {
    // fix zod making anything with undefined optional
    return { count, name, readWorks, reviewed, slug };
  });

export type MostReadAuthor = z.infer<typeof MostReadAuthorSchema>;

export const YearStatsSchema = z.object({
  allStatsYears: z.array(z.string()),
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  workCount: z.number(),
  year: z.string(),
});

export const AlltimeStatsSchema = z.object({
  allStatsYears: z.array(z.string()),
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  gradeDistribution: z.array(GradeDistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  reviewCount: z.number(),
  workCount: z.number(),
});

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

// const WorkAuthorSchema = z
//   .object({
//     name: z.string(),
//     notes: z
//       .nullable(z.string())
//       .optional()
//       .transform((v) => v ?? undefined),
//     slug: z
//       .nullable(z.string())
//       .optional()
//       .transform((v) => v ?? undefined),
//   })
//   .transform(({ name, notes, slug }) => {
//     // fix zod making anything with undefined optional
//     return { name, notes, slug };
//   });

const MoreByAuthorSchema = z.object({
  author: z.string(),
  reviews: z.array(reference("reviewedWorks")),
});

export const ReviewedWorkSchema = z
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

// export const WorkSchema = z
//   .object({
//     authors: z.array(WorkAuthorSchema),
//     id: z.string(),
//     kind: z.string(),
//     review: z.nullable(reference("reviews")),
//     sortTitle: z.string(),
//     subtitle: z
//       .nullable(z.string())
//       .optional()
//       .transform((v) => v ?? undefined),
//     title: z.string(),
//     year: z.string(),
//   })
//   .transform(
//     ({ authors, id, kind, review, sortTitle, subtitle, title, year }) => {
//       // fix zod making anything with undefined optional
//       return {
//         authors,
//         id,
//         kind,
//         review,
//         sortTitle,
//         subtitle,
//         title,
//         year,
//       };
//     },
//   );

// export type WorkAuthor = z.infer<typeof WorkAuthorSchema>;
