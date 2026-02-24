import { getCollection } from "astro:content";

import type { ReadingData } from "~/content.config";

import { getAuthorDetails } from "~/api/authors";
import { getFluidCoverImageProps } from "~/api/covers";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { AuthorTitlesProps, AuthorTitlesValue } from "./AuthorTitles";

// AIDEV-NOTE: gradeToValue converts a letter grade to a numeric sort value.
// Must handle "Abandoned" (0) in addition to letter grades per the spec.

export async function getAuthorTitlesProps(
  slug: string,
): Promise<AuthorTitlesProps> {
  const [worksEntries, reviewsEntries, readingsEntries, authorsEntries] =
    await Promise.all([
      getCollection("works"),
      getCollection("reviews"),
      getCollection("readings"),
      getCollection("authors"),
    ]);

  const works = worksEntries.map((e) => e.data);
  const reviews = reviewsEntries.map((e) => e.data);
  const authors = authorsEntries.map((e) => e.data);

  const details = getAuthorDetails(slug, authors, works, reviews);
  if (!details) throw new Error(`Author not found: ${slug}`);

  const { distinctKinds, distinctReviewYears, distinctWorkYears } = details;

  const reviewsMap = new Map(reviews.map((r) => [r.slug.id, r]));
  const authorsMap = new Map(authors.map((a) => [a.slug, a]));

  // Group readings by workSlug for reviewSequence computation
  const readingsByWork = new Map<string, ReadingData[]>();
  for (const entry of readingsEntries) {
    const list = readingsByWork.get(entry.data.workSlug) ?? [];
    list.push(entry.data);
    readingsByWork.set(entry.data.workSlug, list);
  }

  // Works this author contributed to that are reviewed
  const reviewedSlugs = new Set(reviews.map((r) => r.slug.id));
  const authorWorks = worksEntries.filter(
    (e) =>
      reviewedSlugs.has(e.id) && e.data.authors.some((a) => a.slug === slug),
  );

  const values = await Promise.all(
    authorWorks.map(async (workEntry) => {
      const work = workEntry.data;
      const review = reviewsMap.get(workEntry.id)!;

      const otherAuthors = work.authors
        .filter((a) => a.slug !== slug)
        .map((a) => ({ name: authorsMap.get(a.slug)?.name ?? a.slug }));

      const value: AuthorTitlesValue = {
        coverImageProps: await getFluidCoverImageProps(
          { slug: workEntry.id },
          CoverListItemImageConfig,
        ),
        displayDate: displayDate(review.date),
        grade: review.grade,
        gradeValue: gradeToValue(review.grade),
        kind: work.kind,
        otherAuthors,
        reviewDate: review.date,
        reviewSequence: getReviewSequence(workEntry.id, readingsByWork),
        reviewYear: String(review.date.getFullYear()),
        slug: workEntry.id,
        sortTitle: work.sortTitle,
        title: work.title,
        workYear: work.workYear,
      };

      return value;
    }),
  );

  return {
    distinctKinds,
    distinctReviewYears,
    distinctWorkYears,
    initialSort: "title-asc",
    values,
  };
}

// AIDEV-NOTE: reviewSequence = slug of the most recent reading for a work, derived by
// sorting the work's readings by date descending and taking the first entry's slug.
function getReviewSequence(
  workSlug: string,
  readingsByWork: Map<string, ReadingData[]>,
): string {
  const readings = readingsByWork.get(workSlug) ?? [];
  if (readings.length === 0) return "";
  return readings.toSorted((a, b) => b.date.getTime() - a.date.getTime())[0]
    .slug;
}

function gradeToValue(grade: string): number {
  const gradeValues: Record<string, number> = {
    A: 12,
    "A-": 11,
    Abandoned: 0,
    B: 9,
    "B+": 10,
    "B-": 8,
    C: 6,
    "C+": 7,
    "C-": 5,
    D: 3,
    "D+": 4,
    "D-": 2,
    F: 1,
  };
  return gradeValues[grade] ?? 0;
}
