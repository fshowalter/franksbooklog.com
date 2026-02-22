import { remark } from "remark";
import remarkGfm from "remark-gfm";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import type {
  ReadingData,
  ReviewData,
  ReviewedWorkData,
} from "~/content.config";

import { linkReviewedWorks } from "./utils/linkReviewedWorks";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";
import { trimToExcerpt } from "./utils/markdown/trimToExcerpt";

// AIDEV-NOTE: Review type merges ReviewedWorkData (work metadata) and ReviewData (review
// content). Both are spread together — work_slug.id in ReviewData must match slug in
// ReviewedWorkData for the join. moreReviews is now { collection, id }[] references;
// resolve by looking up id against the works array passed to loadContent/getReviewProps.
export type Review = ReviewData & ReviewedWorkData & {};

export type ReviewWithContent = Omit<Review, "readings"> & {
  content: string | undefined;
  excerptPlainText: string;
  readings: ReviewReading[];
};

// ReviewReading combines the JSON reading session data (date, abandoned, etc.) with
// enriched data from the ReadingData collection (edition, notes, timeline).
// Matched by work_slug.id === review.slug (one ReadingData per work matches all sessions).
type ReviewReading = ReviewedWorkData["readings"][0] & {
  edition: string;
  editionNotes: string | undefined;
  readingNotes: string | undefined;
  timeline: ReadingData["timeline"];
};

type ReviewsResult = {
  distinctKinds: string[];
  distinctReviewYears: string[];
  distinctWorkYears: string[];
  reviews: Review[];
};

export function allReviews(
  works: ReviewedWorkData[],
  reviews: ReviewData[],
): ReviewsResult {
  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<string>();
  const distinctWorkYears = new Set<string>();

  const result = works.map((work) => {
    distinctKinds.add(work.kind);
    distinctReviewYears.add(work.reviewYear);
    distinctWorkYears.add(work.workYear);

    const reviewData = reviews.find((r) => r.work_slug.id === work.slug)!;

    return { ...work, ...reviewData } as Review;
  });

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

export function loadContent(
  review: Review,
  readings: ReadingData[],
  reviewedWorks: ReviewedWorkData[],
): ReviewWithContent {
  const excerptPlainText = getMastProcessor()
    .use(removeFootnotes)
    .use(trimToExcerpt)
    .use(strip)
    .processSync(review.body)
    .toString();

  // AIDEV-NOTE: Match ReadingData by work_slug only (not by sequence) to preserve
  // parity with old behavior. If a work has multiple ReadingData entries, all JSON
  // reading sessions share the notes from the first matching ReadingData.
  const reviewReadings = review.readings
    .map((reading) => {
      const readingData = readings.find((r) => r.work_slug.id === review.slug);

      if (!readingData) {
        throw new Error(`No reading data found for ${review.slug}`);
      }

      return {
        ...reading,
        edition: readingData.edition,
        editionNotes: readingData.intermediateEditionNotesHtml
          ? linkReviewedWorks(
              readingData.intermediateEditionNotesHtml,
              reviewedWorks,
            )
          : undefined,
        readingNotes: readingData.intermediateReadingNotesHtml
          ? linkReviewedWorks(
              readingData.intermediateReadingNotesHtml,
              reviewedWorks,
            )
          : undefined,
        timeline: readingData.timeline,
      };
    }) // eslint-disable-next-line unicorn/no-array-sort
    .sort((a, b) => {
      return +b.date - +a.date;
    });

  return {
    ...review,
    content: linkReviewedWorks(review.intermediateHtml, reviewedWorks),
    excerptPlainText,
    readings: reviewReadings,
  };
}

export function loadExcerptHtml(review: ReviewData): string {
  return review.excerptHtml;
}

export function mostRecentReviews(reviews: Review[], limit: number): Review[] {
  return reviews
    .toSorted((a, b) => b.reviewSequence.localeCompare(a.reviewSequence))
    .slice(0, limit);
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
