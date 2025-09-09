import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import { allAuthorsJson, type AuthorJson } from "./data/authors-json";

/**
 * Author data type extending the base AuthorJson with API layer enhancements
 */
export type Author = AuthorJson & {};

/**
 * Type representing detailed author information with metadata arrays.
 * Includes the author data plus distinct values for filtering purposes.
 */
type AuthorDetails = {
  author: Author;
  distinctKinds: string[];
  distinctReviewYears: string[];
  distinctWorkYears: string[];
};

// Cache at API level for derived data
let cachedAllAuthorsJson: AuthorJson[];
const cachedAuthorDetails: Map<string, AuthorDetails> = new Map();

/**
 * Retrieves all authors with their associated reviewed works.
 * Results are cached in production for performance.
 * 
 * @returns Promise resolving to an array of all authors
 */
export async function allAuthors(): Promise<Author[]> {
  return await perfLogger.measure("allAuthors", async () => {
    if (ENABLE_CACHE && cachedAllAuthorsJson) {
      return cachedAllAuthorsJson;
    }

    const authors = cachedAllAuthorsJson || (await allAuthorsJson());
    if (ENABLE_CACHE && !cachedAllAuthorsJson) {
      cachedAllAuthorsJson = authors;
    }

    return authors;
  });
}

/**
 * Retrieves detailed information for a specific author including metadata about their works.
 * Extracts and sorts distinct kinds, work years, and review years for filtering.
 * Results are cached in production for performance.
 * 
 * @param slug - The unique slug identifier for the author
 * @returns Promise resolving to author details with distinct metadata arrays
 */
export async function getAuthorDetails(slug: string): Promise<AuthorDetails> {
  return await perfLogger.measure("getAuthorDetails", async () => {
    // Check cache first
    if (ENABLE_CACHE && cachedAuthorDetails.has(slug)) {
      return cachedAuthorDetails.get(slug)!;
    }

    const authors = cachedAllAuthorsJson || (await allAuthorsJson());
    if (ENABLE_CACHE && !cachedAllAuthorsJson) {
      cachedAllAuthorsJson = authors;
    }

    const distinctKinds = new Set<string>();
    const distinctWorkYears = new Set<string>();
    const distinctReviewYears = new Set<string>();

    const author = authors.find((value) => value.slug === slug)!;

    for (const work of author.reviewedWorks) {
      distinctKinds.add(work.kind);
      distinctWorkYears.add(work.workYear);
      distinctReviewYears.add(work.reviewYear);
    }

    const details = {
      author,
      distinctKinds: [...distinctKinds].toSorted(),
      distinctReviewYears: [...distinctReviewYears].toSorted(),
      distinctWorkYears: [...distinctWorkYears].toSorted(),
    };

    // Cache the result
    if (ENABLE_CACHE) {
      cachedAuthorDetails.set(slug, details);
    }

    return details;
  });
}
