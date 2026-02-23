import type { AuthorData, ReviewData, WorkData } from "~/content.config";

// AIDEV-NOTE: Author = AuthorData (reviewedWorks field removed in Stage 2).
// getAuthorDetails now accepts works and reviews arrays directly, filtering to works
// where this author is listed and a review entry exists.
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
  works: WorkData[],
  reviews: ReviewData[],
): AuthorDetails | undefined {
  const author = authors.find((a) => a.slug === slug);
  if (!author) return undefined;

  // r.slug.id = work slug (reference("works") coerced by parseData)
  const reviewedSlugs = new Set(reviews.map((r) => r.slug.id));

  const authorWorks = works.filter(
    (w) => reviewedSlugs.has(w.slug) && w.authors.some((a) => a.slug === slug),
  );

  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<string>();
  const distinctWorkYears = new Set<string>();

  for (const work of authorWorks) {
    const review = reviews.find((r) => r.slug.id === work.slug)!;
    distinctKinds.add(work.kind);
    distinctReviewYears.add(String(review.date.getFullYear()));
    distinctWorkYears.add(work.workYear);
  }

  return {
    author,
    distinctKinds: [...distinctKinds].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    distinctWorkYears: [...distinctWorkYears].toSorted(),
  };
}
