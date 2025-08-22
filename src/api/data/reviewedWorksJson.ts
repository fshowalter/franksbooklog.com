import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";
import { perfLogger } from "./utils/performanceLogger";
import { WorkKindSchema } from "./WorkKindSchema";

const reviewedWorksJsonFile = getContentPath("data", "reviewed-works.json");

const ReadingSchema = z.object({
  abandoned: z.boolean(),
  date: z.coerce.date(),
  isAudiobook: z.boolean(),
  readingSequence: z.number(),
  readingTime: z.number(),
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
  grade: nullableString(),
  kind: WorkKindSchema,
  slug: nullableString(),
  title: z.string(),
  workYear: z.string(),
});

const MoreReviewAuthorSchema = z
  .object({
    name: z.string(),
    notes: nullableString(),
  })
  .transform(({ name, notes }) => {
    // fix zod making anything with undefined optional
    return { name, notes };
  });

const MoreReviewSchema = z.object({
  authors: z.array(MoreReviewAuthorSchema),
  grade: z.string(),
  gradeValue: z.number(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  reviewDate: z.string(),
  reviewSequence: z.number(),
  reviewYear: z.string(),
  slug: z.string(),
  sortTitle: z.string(),
  subtitle: nullableString(),
  title: z.string(),
  workYear: z.string(),
});

const MoreByAuthorSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(MoreReviewSchema),
  slug: z.string(),
  sortName: z.string(),
});

const ReviewedWorkJsonSchema = z
  .object({
    authors: z.array(AuthorSchema),
    authorSequence: z.number(),
    grade: z.string(),
    gradeValue: z.number(),
    includedInSlugs: z.array(z.string()),
    includedWorks: z.array(IncludedWorkSchema).optional(),
    kind: WorkKindSchema,
    moreByAuthors: z.array(MoreByAuthorSchema),
    moreReviews: z.array(MoreReviewSchema),
    readings: z.array(ReadingSchema),
    reviewDate: z.string(),
    reviewSequence: z.number(),
    reviewYear: z.string(),
    slug: z.string(),
    sortTitle: z.string(),
    subtitle: nullableString(),
    title: z.string(),
    workYear: z.string(),
    workYearSequence: z.number(),
  })
  .transform(
    ({
      authors,
      authorSequence,
      grade,
      gradeValue,
      includedInSlugs,
      includedWorks,
      kind,
      moreByAuthors,
      moreReviews,
      readings,
      reviewDate,
      reviewSequence,
      reviewYear,
      slug,
      sortTitle,
      subtitle,
      title,
      workYear,
      workYearSequence,
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
        authorSequence,
        grade,
        gradeValue,
        includedInSlugs,
        includedWorks: includedWorks ?? [],
        kind,
        moreByAuthors,
        moreReviews,
        readings,
        reviewDate,
        reviewSequence,
        reviewYear,
        slug,
        sortTitle,
        subtitle,
        title,
        workYear,
        workYearSequence,
      };
    },
  );

export type ReviewedWorkJson = z.infer<typeof ReviewedWorkJsonSchema>;

export type ReviewedWorkJsonReading = z.infer<typeof ReadingSchema>;

// Cache at data layer - lazy caching for better build performance
let cachedReviewedWorksJson: ReviewedWorkJson[];

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

export async function allReviewedWorksJson(): Promise<ReviewedWorkJson[]> {
  return await perfLogger.measure("allReviewedWorksJson", async () => {
    if (ENABLE_CACHE && cachedReviewedWorksJson) {
      return cachedReviewedWorksJson;
    }

    const works = await parseAllReviewedWorksJson();

    if (ENABLE_CACHE) {
      cachedReviewedWorksJson = works;
    }

    return works;
  });
}

async function parseAllReviewedWorksJson() {
  return await perfLogger.measure("parseAllReviewedWorksJson", async () => {
    const json = await fs.readFile(reviewedWorksJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((item) => {
      return ReviewedWorkJsonSchema.parse(item);
    });
  });
}
