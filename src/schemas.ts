import { reference, z } from "astro:content";

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

const ReadingLogWorkAuthorSchema = z
  .object({
    name: z.string(),
    notes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
  })
  .transform(({ name, notes }) => {
    // fix zod making anything with undefined optional
    return { name, notes };
  });

const ReviewedAuthorWorkSchema = z.object({
  authors: z.array(ReviewedWorkAuthorSchema),
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

export const ReadingLogSchema = z
  .object({
    authors: z.array(ReadingLogWorkAuthorSchema),
    date: z.coerce.date(),
    edition: z.string(),
    id: z.string(),
    kind: z.string(),
    progress: z.string(),
    reviewSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    sequence: z.string(),
    title: z.string(),
    workYear: z.string(),
  })
  .transform(
    ({
      authors,
      date,
      edition,
      id,
      kind,
      progress,
      reviewSlug,
      sequence,
      title,
      workYear,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        date,
        edition,
        id,
        kind,
        progress,
        reviewSlug,
        sequence,
        title,
        workYear,
      };
    },
  );

export const ReviewedAuthorSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(ReviewedAuthorWorkSchema),
  slug: z.string(),
  sortName: z.string(),
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
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  workCount: z.number(),
  year: z.string(),
});

export const AlltimeStatsSchema = z.object({
  bookCount: z.number(),
  decadeDistribution: z.array(DistributionSchema),
  editionDistribution: z.array(DistributionSchema),
  gradeDistribution: z.array(GradeDistributionSchema),
  kindDistribution: z.array(DistributionSchema),
  mostReadAuthors: z.array(MostReadAuthorSchema),
  reviewCount: z.number(),
  statsYears: z.array(z.string()),
  workCount: z.number(),
});

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
