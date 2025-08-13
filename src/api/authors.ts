import { allAuthorsJson, type AuthorJson } from "./data/authorsJson";
import { perfLogger } from "./data/utils/performanceLogger";

export type Author = AuthorJson & {};

type AuthorDetails = {
  author: Author;
  distinctKinds: string[];
  distinctPublishedYears: string[];
};

// Cache at API level for derived data
let cachedAllAuthors: Author[];
let cachedAllAuthorsJson: AuthorJson[];
const cachedAuthorDetails: Map<string, AuthorDetails> = new Map();

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

export async function allAuthors(): Promise<Author[]> {
  return await perfLogger.measure("allAuthors", async () => {
    if (ENABLE_CACHE && cachedAllAuthorsJson) {
      return cachedAllAuthorsJson;
    }

    const authors = cachedAllAuthorsJson || (await allAuthorsJson());
    if (ENABLE_CACHE && !cachedAllAuthors) {
      cachedAllAuthors = authors;
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
    const distinctPublishedYears = new Set<string>();

    const author = authors.find((value) => value.slug === slug)!;

    for (const work of author.reviewedWorks) {
      distinctKinds.add(work.kind);
      distinctPublishedYears.add(work.yearPublished);
    }

    const details = {
      author,
      distinctKinds: [...distinctKinds].toSorted(),
      distinctPublishedYears: [...distinctPublishedYears].toSorted(),
    };

    // Cache the result
    if (ENABLE_CACHE) {
      cachedAuthorDetails.set(slug, details);
    }

    return details;
  });
}
