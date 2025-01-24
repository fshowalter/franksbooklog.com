import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";
import { WorkKindSchema } from "./WorkKindSchema";

const reviewedWorksJsonFile = getContentPath("data", "reviewed-works.json");

const ReadingSchema = z.object({
  abandoned: z.boolean(),
  date: z.coerce.date(),
  isAudiobook: z.boolean(),
  readingTime: z.number(),
  sequence: z.number(),
});

const AuthorSchema = z
  .object({
    name: z.string(),
    notes: nullableString(),
    slug: z.string(),
    sortName: z.string(),
  })
  .transform(({ name, notes, slug, sortName }) => {
    // fix zod making anything with undefined optional
    return { name, notes, slug, sortName };
  });

const IncludedWorkAuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

const IncludedWorkSchema = z.object({
  authors: z.array(IncludedWorkAuthorSchema),
  grade: z.string(),
  kind: WorkKindSchema,
  slug: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

const MoreReviewAuthorSchema = z.object({
  name: z.string(),
});

const MoreReviewSchema = z.object({
  authors: z.array(MoreReviewAuthorSchema),
  grade: z.string(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  slug: z.string(),
  title: z.string(),
  yearPublished: z.string(),
});

const MoreByAuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
  works: z.array(MoreReviewSchema),
});

const ReviewedWorkJsonSchema = z
  .object({
    authors: z.array(AuthorSchema),
    gradeValue: z.number(),
    includedInSlugs: z.array(z.string()),
    includedWorks: z.array(IncludedWorkSchema),
    kind: WorkKindSchema,
    moreByAuthors: z.array(MoreByAuthorSchema),
    moreReviews: z.array(MoreReviewSchema),
    readings: z.array(ReadingSchema),
    sequence: z.string(),
    slug: z.string(),
    sortTitle: z.string(),
    subtitle: nullableString(),
    title: z.string(),
    yearPublished: z.string(),
  })
  .transform(
    ({
      authors,
      gradeValue,
      includedInSlugs,
      includedWorks,
      kind,
      moreByAuthors,
      moreReviews,
      readings,
      sequence,
      slug,
      sortTitle,
      subtitle,
      title,
      yearPublished,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        gradeValue,
        includedInSlugs,
        includedWorks,
        kind,
        moreByAuthors,
        moreReviews,
        readings,
        sequence,
        slug,
        sortTitle,
        subtitle,
        title,
        yearPublished,
      };
    },
  );

export type ReviewedWorkJson = z.infer<typeof ReviewedWorkJsonSchema>;

export type ReviewedWorkJsonReading = z.infer<typeof ReadingSchema>;

export async function allReviewedWorksJson(): Promise<ReviewedWorkJson[]> {
  return await parseAllReviewedWorksJson();
}

async function parseAllReviewedWorksJson() {
  const json = await fs.readFile(reviewedWorksJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return ReviewedWorkJsonSchema.parse(item);
  });
}
