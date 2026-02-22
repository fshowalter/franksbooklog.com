import type { AuthorData, ReviewedWorkData } from "~/content.config";

// AIDEV-NOTE: Author = AuthorData; reviewedWorks are { collection, id }[] references
// after parseData(). getAuthorDetails resolves them against ReviewedWorkData[] at call time.
export type Author = AuthorData;

type AuthorDetails = {
  author: Author;
  distinctKinds: string[];
  distinctReviewYears: string[];
  distinctWorkYears: string[];
};

export function allAuthors(authors: AuthorData[]): Author[] {
  return authors;
}

export function getAuthorDetails(
  slug: string,
  authors: AuthorData[],
  works: ReviewedWorkData[],
): AuthorDetails | undefined {
  const author = authors.find((a) => a.slug === slug);
  if (!author) return undefined;

  const authorWorks = author.reviewedWorks
    .map((ref) => works.find((w) => w.slug === ref.id))
    .filter((w): w is ReviewedWorkData => w !== undefined);

  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<string>();
  const distinctWorkYears = new Set<string>();

  for (const work of authorWorks) {
    distinctKinds.add(work.kind);
    distinctReviewYears.add(work.reviewYear);
    distinctWorkYears.add(work.workYear);
  }

  return {
    author,
    distinctKinds: [...distinctKinds].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    distinctWorkYears: [...distinctWorkYears].toSorted(),
  };
}
