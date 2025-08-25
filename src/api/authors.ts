import { ENABLE_CACHE } from "~/utils/cache";

import { allAuthorsJson, type AuthorJson } from "./data/authorsJson";
import { perfLogger } from "./data/utils/performanceLogger";
export type Author = AuthorJson & {};

type AuthorDetails = {
  author: Author;
  distinctKinds: string[];
  distinctReviewYears: string[];
  distinctWorkYears: string[];
};

// Cache at API level for derived data
let cachedAllAuthorsJson: AuthorJson[];
const cachedAuthorDetails: Map<string, AuthorDetails> = new Map();

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
