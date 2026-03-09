import { reference, z } from "astro:content";

const DistributionSchema = z.object({
  count: z.number(),
  name: z.string(),
});

const GradeDistributionSchema = DistributionSchema.extend({
  sortValue: z.number(),
});

const MostReadAuthorSchema = z
  .object({
    count: z.number(),
    name: z.string(),
    readings: z.array(reference("readings")),
    reviewed: z.boolean(),
    slug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
  })
  .transform(({ count, name, readings, reviewed, slug }) => {
    // fix zod making anything with undefined optional
    return { count, name, readings, reviewed, slug };
  });

export type MostReadAuthor = z.infer<typeof MostReadAuthorSchema>;

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

const WorkAuthorSchema = z
  .object({
    name: z.string(),
    notes: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    slug: z.string(),
  })
  .transform(({ name, notes, slug }) => {
    // fix zod making anything with undefined optional
    return { name, notes, slug };
  });

const MoreByAuthorSchema = z.object({
  author: z.string(),
  reviews: z.array(reference("reviewedWorks")),
});

export const WorkSchema = z.discriminatedUnion("reviewed", [
  z.object({
    authors: z.array(WorkAuthorSchema),
    grade: z.string(),
    id: z.string(),
    includedInWorks: z.array(reference("reviewedWorks")),
    includedWorks: z.array(reference("reviewedWorks")),
    kind: z.string(),
    moreByAuthors: z.array(MoreByAuthorSchema),
    moreReviews: z.array(reference("reviewedWorks")),
    review: reference("reviews"),
    reviewDate: z.coerce.date(),
    reviewed: z.literal(true),
    reviewSequence: z.string(),
    sortTitle: z.string(),
    subtitle: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
    workYear: z.string(),
  }),
  z.object({
    authors: z.array(WorkAuthorSchema),
    id: z.string(),
    kind: z.string(),
    reviewed: z.literal(false),
    sortTitle: z.string(),
    subtitle: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
    workYear: z.string(),
  }),
]);

export type WorkAuthor = z.infer<typeof WorkAuthorSchema>;
