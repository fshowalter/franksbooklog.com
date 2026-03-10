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
