import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import type {
  AuthorData,
  ReadingData,
  ReviewData,
  WorkData,
} from "~/content.config";

import { linkReviewedWorks } from "./utils/linkReviewedWorks";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";
import { trimToExcerpt } from "./utils/markdown/trimToExcerpt";

// AIDEV-NOTE: IncludedWork is the enriched shape for included works on a review page.
// Computed in getReviewProps by joining works + reviews + authors collections.
export type IncludedWork = {
  authors: { name: string; slug: string }[];
  grade: string | undefined;
  kind: WorkData["kind"];
  reviewed: boolean;
  slug: string;
  title: string;
  workYear: string;
};

// AIDEV-NOTE: Review type is the computed join of WorkData + ReviewData + derived fields.
// It no longer embeds ReviewedWorkData — gradeValue, reviewDate, reviewYear, reviewSequence,
// and enriched authors are computed in allReviews(). moreByAuthors/moreReviews/readings are
// NOT on Review — they are looked up by getReviewProps from the moreForReviewedWorks and
// readings collections. includedWorks is plain string[] (slugs); enriched in getReviewProps.
export type Review = {
  authors: { name: string; notes: string | undefined; slug: string; sortName: string }[];
  body: string;
  date: Date;
  excerptHtml: string;
  grade: string;
  gradeValue: number;
  includedWorks: string[];
  intermediateHtml: string;
  kind: WorkData["kind"];
  reviewDate: string;
  reviewSequence: string;
  reviewYear: string;
  slug: string;
  sortTitle: string;
  subtitle: string | undefined;
  synopsis: string | undefined;
  title: string;
  workYear: string;
};

export type ReviewWithContent = Omit<Review, "includedWorks"> & {
  content: string | undefined;
  excerptPlainText: string;
  includedWorks: IncludedWork[];
  readings: ReviewReading[];
};

// AIDEV-NOTE: ReviewReading is computed in loadContent from ReadingData:
// - abandoned: last timeline progress === "Abandoned"
// - isAudiobook: edition === "Audiobook"
// - readingSequence: ReadingData.sequence (nth reading of this work)
// - readingTime: (reading.date − timeline[0].date).days + 1
type ReviewReading = {
  abandoned: boolean;
  date: Date;
  edition: string;
  editionNotes: string | undefined;
  isAudiobook: boolean;
  readingNotes: string | undefined;
  readingSequence: number;
  readingTime: number;
  timeline: ReadingData["timeline"];
};

type ReviewsResult = {
  distinctKinds: string[];
  distinctReviewYears: string[];
  distinctWorkYears: string[];
  reviews: Review[];
};

// AIDEV-NOTE: allReviews joins WorkData + ReviewData + AuthorData + ReadingData into
// Review objects. Only works that have a matching ReviewData entry are included.
// Derived fields (gradeValue, reviewDate, reviewYear, reviewSequence, enriched authors)
// are computed here. The collections are the shared data layer — no pre-joined
// reviewedWorks collection is needed.
export function allReviews(
  works: WorkData[],
  reviews: ReviewData[],
  authors: AuthorData[],
  readings: ReadingData[],
): ReviewsResult {
  const authorsMap = new Map(authors.map((a) => [a.slug, a]));
  const reviewsMap = new Map(reviews.map((r) => [r.slug.id, r]));

  // Group readings by workSlug for reviewSequence computation
  const readingsByWork = new Map<string, ReadingData[]>();
  for (const reading of readings) {
    const list = readingsByWork.get(reading.workSlug) ?? [];
    list.push(reading);
    readingsByWork.set(reading.workSlug, list);
  }

  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<string>();
  const distinctWorkYears = new Set<string>();

  const result: Review[] = [];

  for (const work of works) {
    const reviewData = reviewsMap.get(work.slug);
    if (!reviewData) continue; // skip unreviewed works

    const reviewDate = reviewData.date.toISOString().slice(0, 10);
    const reviewYear = reviewDate.slice(0, 4);

    distinctKinds.add(work.kind);
    distinctReviewYears.add(reviewYear);
    distinctWorkYears.add(work.workYear);

    const reviewSequence = getReviewSequence(work.slug, readingsByWork);

    const enrichedAuthors = work.authors.map((a) => {
      const author = authorsMap.get(a.slug);
      return {
        name: author?.name ?? a.slug,
        notes: a.notes,
        slug: a.slug,
        sortName: author?.sortName ?? a.slug,
      };
    });

    result.push({
      authors: enrichedAuthors,
      body: reviewData.body,
      date: reviewData.date,
      excerptHtml: reviewData.excerptHtml,
      grade: reviewData.grade,
      gradeValue: gradeToValue(reviewData.grade),
      includedWorks: work.includedWorks,
      intermediateHtml: reviewData.intermediateHtml,
      kind: work.kind,
      reviewDate,
      reviewSequence,
      reviewYear,
      slug: work.slug,
      sortTitle: work.sortTitle,
      subtitle: work.subtitle,
      synopsis: reviewData.synopsis,
      title: work.title,
      workYear: work.workYear,
    });
  }

  return {
    distinctKinds: [...distinctKinds].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    distinctWorkYears: [...distinctWorkYears].toSorted(),
    reviews: result,
  };
}

/**
 * Converts raw markdown content to plain text by removing footnotes and markdown formatting.
 * Used for generating excerpt text and search indexing.
 *
 * @param rawContent - The raw markdown content to process
 * @returns Plain text version of the content
 */
export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

// AIDEV-NOTE: loadContent produces a ReviewWithContent by:
// 1. Linking work spans in intermediateHtml, editionNotes, and readingNotes
// 2. Computing reading fields (abandoned, isAudiobook, readingTime, readingSequence)
//    from ReadingData — sorted by date descending (most recent first)
// 3. Including pre-enriched includedWorks (computed by getReviewProps before calling here)
// reviews param provides the set of reviewed slugs for linkReviewedWorks.
export function loadContent(
  review: Review,
  readings: ReadingData[],
  reviews: ReviewData[],
  enrichedIncludedWorks: IncludedWork[],
): ReviewWithContent {
  const excerptPlainText = getMastProcessor()
    .use(removeFootnotes)
    .use(trimToExcerpt)
    .use(strip)
    .processSync(review.body)
    .toString();

  const reviewedSlugs = reviews.map((r) => ({ slug: r.slug.id }));

  // Filter readings for this work, sort most-recent first
  const workReadings = readings
    .filter((r) => r.workSlug === review.slug)
    // eslint-disable-next-line unicorn/no-array-sort
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const reviewReadings: ReviewReading[] = workReadings.map((reading) => {
    const lastProgress = reading.timeline.at(-1)?.progress ?? "";
    return {
      abandoned: lastProgress === "Abandoned",
      date: reading.date,
      edition: reading.edition,
      editionNotes: reading.intermediateEditionNotesHtml
        ? linkReviewedWorks(reading.intermediateEditionNotesHtml, reviewedSlugs)
        : undefined,
      isAudiobook: reading.edition === "Audiobook",
      readingNotes: reading.intermediateReadingNotesHtml
        ? linkReviewedWorks(reading.intermediateReadingNotesHtml, reviewedSlugs)
        : undefined,
      readingSequence: reading.sequence,
      readingTime: computeReadingTime(reading),
      timeline: reading.timeline,
    };
  });

  return {
    ...review,
    content: linkReviewedWorks(review.intermediateHtml, reviewedSlugs),
    excerptPlainText,
    includedWorks: enrichedIncludedWorks,
    readings: reviewReadings,
  };
}

export function loadExcerptHtml(review: { excerptHtml: string }): string {
  return review.excerptHtml;
}

export function mostRecentReviews(reviews: Review[], limit: number): Review[] {
  return reviews
    .toSorted((a, b) => b.reviewSequence.localeCompare(a.reviewSequence))
    .slice(0, limit);
}

function computeReadingTime(reading: ReadingData): number {
  if (reading.timeline.length === 0) return 1;
  const start = reading.timeline[0].date;
  const end = reading.date;
  return (
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

// AIDEV-NOTE: reviewSequence = slug of the most recent reading for a work, derived by
// sorting the work's readings by date descending and taking the first entry's slug.
// Returns "" when no readings exist (unread review).
function getReviewSequence(
  workSlug: string,
  readingsByWork: Map<string, ReadingData[]>,
): string {
  const readings = readingsByWork.get(workSlug) ?? [];
  if (readings.length === 0) return "";
  return readings.toSorted((a, b) => b.date.getTime() - a.date.getTime())[0]
    .slug;
}

// AIDEV-NOTE: gradeToValue converts a letter grade to a numeric sort value.
// "Abandoned" is 0; letter grades range from F=1 to A=12.
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
