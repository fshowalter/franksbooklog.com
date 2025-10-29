import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";
import { WorkKindSchema } from "./WorkKindSchema";

const reviewedWorksJsonFile = getContentPath("data", "reviewed-works.json");

/**
 * Zod schema for reading session data within reviewed works.
 * Contains timing and format information for individual readings.
 */
const ReadingSchema = z.object({
  abandoned: z.boolean(),
  date: z.coerce.date(),
  isAudiobook: z.boolean(),
  readingSequence: z.number(),
  readingTime: z.number(),
});

/**
 * Zod schema for author information within reviewed works.
 * Includes comprehensive author metadata and notes.
 */
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

/**
 * Zod schema for author information within included works.
 * Simplified author data for works included in collections.
 */
const IncludedWorkAuthorSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

/**
 * Zod schema for works included within anthology or collection reviews.
 * Represents individual stories or pieces within a larger work.
 */
const IncludedWorkSchema = z.object({
  authors: z.array(IncludedWorkAuthorSchema),
  grade: nullableString(),
  kind: WorkKindSchema,
  reviewed: z.boolean(),
  slug: z.string(),
  title: z.string(),
  workYear: z.string(),
});

/**
 * Zod schema for author information in "more reviews" sections.
 * Simplified author data for cross-referencing purposes.
 */
const MoreReviewAuthorSchema = z
  .object({
    name: z.string(),
    notes: nullableString(),
  })
  .transform(({ name, notes }) => {
    // fix zod making anything with undefined optional
    return { name, notes };
  });

/**
 * Zod schema for additional review references.
 * Used to link related reviews by the same or different authors.
 */
const MoreReviewSchema = z.object({
  authors: z.array(MoreReviewAuthorSchema),
  grade: z.string(),
  gradeValue: z.number(),
  includedInSlugs: z.array(z.string()),
  kind: WorkKindSchema,
  reviewDate: z.string(),
  reviewSequence: z.string(),
  reviewYear: z.string(),
  slug: z.string(),
  sortTitle: z.string(),
  subtitle: nullableString(),
  title: z.string(),
  workYear: z.string(),
});

/**
 * Zod schema for "more by author" sections.
 * Groups additional reviews by the same author.
 */
const MoreByAuthorSchema = z.object({
  name: z.string(),
  reviewedWorks: z.array(MoreReviewSchema),
  slug: z.string(),
  sortName: z.string(),
});

/**
 * Main Zod schema for reviewed work data from JSON.
 * Contains comprehensive review information including metadata, readings, and cross-references.
 */
const ReviewedWorkJsonSchema = z
  .object({
    authors: z.array(AuthorSchema),
    grade: z.string(),
    gradeValue: z.number(),
    includedInSlugs: z.array(z.string()),
    includedWorks: z.array(IncludedWorkSchema).optional(),
    kind: WorkKindSchema,
    moreByAuthors: z.array(MoreByAuthorSchema),
    moreReviews: z.array(MoreReviewSchema),
    readings: z.array(ReadingSchema),
    reviewDate: z.string(),
    reviewSequence: z.string(),
    reviewYear: z.string(),
    slug: z.string(),
    sortTitle: z.string(),
    subtitle: nullableString(),
    title: z.string(),
    workYear: z.string(),
  })
  .transform(
    ({
      authors,
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
    }) => {
      // fix zod making anything with undefined optional
      return {
        authors,
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
      };
    },
  );

/**
 * Type representing a complete reviewed work with all associated data.
 * Contains review metadata, reading history, and related work references.
 */
export type ReviewedWorkJson = z.infer<typeof ReviewedWorkJsonSchema>;

/**
 * Type representing reading session data for a reviewed work.
 */
export type ReviewedWorkJsonReading = z.infer<typeof ReadingSchema>;

// Cache at data layer - lazy caching for better build performance
let cachedReviewedWorksJson: ReviewedWorkJson[];

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

/**
 * Loads and validates all reviewed works from the JSON file.
 * Contains comprehensive data about all books that have been reviewed.
 *
 * @returns Promise resolving to array of validated reviewed work data
 * @throws ZodError if any work doesn't match the expected schema
 *
 * @example
 * ```typescript
 * const works = await allReviewedWorksJson();
 * const fiveStarBooks = works.filter(work => work.gradeValue === 5);
 * console.log(`${fiveStarBooks.length} five-star books`);
 * ```
 */
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

/**
 * Internal function to parse reviewed works from the JSON file.
 * Reads the file and validates each work against the schema.
 *
 * @returns Promise resolving to array of parsed and validated reviewed works
 * @throws ZodError if any work doesn't match the expected schema
 */
async function parseAllReviewedWorksJson() {
  return await perfLogger.measure("parseAllReviewedWorksJson", async () => {
    const json = await fs.readFile(reviewedWorksJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((item) => {
      return ReviewedWorkJsonSchema.parse(item);
    });
  });
}
