import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import type { MarkdownReading } from "./data/readings-markdown";
import type {
  ReviewedWorkJson,
  ReviewedWorkJsonReading,
} from "./data/reviewed-works-json";
import type { MarkdownReview } from "./data/reviews-markdown";

import { allReadingsMarkdown } from "./data/readings-markdown";
import { allReviewedWorksJson } from "./data/reviewed-works-json";
import { allReviewsMarkdown } from "./data/reviews-markdown";
import { linkReviewedWorks } from "./utils/linkReviewedWorks";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";
import { trimToExcerpt } from "./utils/markdown/trimToExcerpt";

// Cache at API level for derived data
let cachedReviews: Reviews;
let cachedMarkdownReviews: MarkdownReview[];
let cachedMarkdownReadings: MarkdownReading[];
let cachedReviewedWorksJson: ReviewedWorkJson[];
const cachedExcerptHtml: Map<string, string> = new Map();

/**
 * Review data type combining markdown content with JSON metadata
 */
export type Review = MarkdownReview & ReviewedWorkJson & {};

/**
 * Review with processed HTML content and enriched reading data
 */
export type ReviewWithContent = Omit<Review, "readings"> & {
  content: string | undefined;
  excerptPlainText: string;
  readings: ReviewReading[];
};

/**
 * Review with processed excerpt HTML for display in lists
 */
export type ReviewWithExcerpt = Review & {
  excerpt: string;
};

/**
 * Type representing a review with HTML excerpt content.
 */
type ReviewExcerpt = {
  excerpt: string;
};

/**
 * Type representing a reading session with processed HTML content.
 * Combines markdown reading data with JSON metadata and processed notes.
 */
type ReviewReading = MarkdownReading &
  ReviewedWorkJsonReading & {
    editionNotes: string | undefined;
    readingNotes: string | undefined;
  };

/**
 * Type representing aggregated reviews data with metadata.
 * Contains all reviews plus distinct values for filtering purposes.
 */
type Reviews = {
  distinctKinds: string[];
  distinctReviewYears: string[];
  distinctWorkYears: string[];
  reviews: Review[];
};

/**
 * Retrieves all reviews with their metadata and distinct filter values.
 * Combines JSON metadata with markdown content for complete review data.
 * Results are cached in production for performance.
 *
 * @returns Promise resolving to reviews data with filter metadata
 */
export async function allReviews(): Promise<Reviews> {
  return await perfLogger.measure("allReviews", async () => {
    if (ENABLE_CACHE && cachedReviews) {
      return cachedReviews;
    }

    const reviewedWorksJson =
      cachedReviewedWorksJson || (await allReviewedWorksJson());
    if (ENABLE_CACHE && !cachedReviewedWorksJson) {
      cachedReviewedWorksJson = reviewedWorksJson;
    }

    const reviews = await parseReviewedWorksJson(reviewedWorksJson);

    if (ENABLE_CACHE) {
      cachedReviews = reviews;
    }

    return reviews;
  });
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

/**
 * Loads and processes complete review content including HTML and enriched reading data.
 * Converts markdown to HTML, processes reading notes, and sorts readings by date.
 *
 * @param review - The base review to load content for
 * @returns Promise resolving to review with processed content and readings
 */
export async function loadContent(review: Review): Promise<ReviewWithContent> {
  return await perfLogger.measure("loadContent", async () => {
    const readingsMarkdown =
      cachedMarkdownReadings || (await allReadingsMarkdown());
    if (ENABLE_CACHE && !cachedMarkdownReadings) {
      cachedMarkdownReadings = readingsMarkdown;
    }

    const reviewedWorksJson =
      cachedReviewedWorksJson || (await allReviewedWorksJson());
    if (ENABLE_CACHE && !cachedReviewedWorksJson) {
      cachedReviewedWorksJson = reviewedWorksJson;
    }

    const excerptPlainText = getMastProcessor()
      .use(removeFootnotes)
      .use(trimToExcerpt)
      .use(strip)
      .processSync(review.rawContent)
      .toString();

    const readings = review.readings
      .map((reading) => {
        const markdownReading = readingsMarkdown.find((markdownReading) => {
          return markdownReading.slug === review.slug;
        })!;

        if (!markdownReading) {
          throw new Error(
            `No markdown readings found with slug ${review.slug}`,
          );
        }

        return {
          ...reading,
          ...markdownReading,
          editionNotes: getHtmlAsSpan(
            markdownReading.editionNotesRaw,
            reviewedWorksJson,
          ),
          readingNotes: getHtml(
            markdownReading.readingNotesRaw,
            reviewedWorksJson,
          ),
        };
      }) // eslint-disable-next-line unicorn/no-array-sort
      .sort((a, b) => {
        return +b.date - +a.date;
      });

    return {
      ...review,
      content: getHtml(review.rawContent, reviewedWorksJson),
      excerptPlainText,
      readings,
    };
  });
}

/**
 * Loads and processes HTML excerpt for a review.
 * Uses synopsis if available, otherwise truncates main content.
 * Results are cached in production for performance.
 *
 * @param review - The review object with slug to load excerpt for
 * @returns Promise resolving to review with HTML excerpt
 */
export async function loadExcerptHtml<T extends { slug: string }>(
  review: T,
): Promise<ReviewExcerpt & T> {
  return await perfLogger.measure("loadExcerptHtml", async () => {
    // Check cache first
    if (ENABLE_CACHE && cachedExcerptHtml.has(review.slug)) {
      return {
        ...review,
        excerpt: cachedExcerptHtml.get(review.slug)!,
      };
    }

    const reviewsMarkdown =
      cachedMarkdownReviews || (await allReviewsMarkdown());
    if (ENABLE_CACHE && !cachedMarkdownReviews) {
      cachedMarkdownReviews = reviewsMarkdown;
    }

    const { rawContent, synopsis } = reviewsMarkdown.find((markdown) => {
      return markdown.slug === review.slug;
    })!;

    const excerptContent = synopsis || rawContent;

    const excerptHtml = getMastProcessor()
      .use(removeFootnotes)
      .use(trimToExcerpt)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .processSync(excerptContent)
      .toString();

    // Cache the result
    if (ENABLE_CACHE) {
      cachedExcerptHtml.set(review.slug, excerptHtml);
    }

    return {
      ...review,
      excerpt: excerptHtml,
    };
  });
}

/**
 * Retrieves the most recently published reviews.
 * Sorts by review sequence and limits results to specified count.
 *
 * @param limit - Maximum number of recent reviews to return
 * @returns Promise resolving to array of recent reviews
 */
export async function mostRecentReviews(limit: number) {
  return await perfLogger.measure("mostRecentReviews", async () => {
    const reviewedWorksJson =
      cachedReviewedWorksJson || (await allReviewedWorksJson());
    if (ENABLE_CACHE && !cachedReviewedWorksJson) {
      cachedReviewedWorksJson = reviewedWorksJson;
    }

    reviewedWorksJson.sort((a, b) =>
      b.reviewSequence.localeCompare(a.reviewSequence),
    );
    const slicedWorks = reviewedWorksJson.slice(0, limit);

    const { reviews } = await parseReviewedWorksJson(slicedWorks);

    return reviews;
  });
}

/**
 * Internal function to process markdown content as inline HTML (span).
 * Used for edition notes and other content that should be inline.
 *
 * @param content - Markdown content to process, may be undefined
 * @param reviewedWorks - Array of reviewed works for automatic linking
 * @returns Processed HTML as inline content, or undefined if no content
 */
function getHtmlAsSpan(
  content: string | undefined,
  reviewedWorks: { slug: string }[],
) {
  if (!content) {
    return;
  }

  const html = getMastProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(content)
    .toString();

  return linkReviewedWorks(html, reviewedWorks);
}

/**
 * Internal function to create a configured remark processor.
 * Includes GitHub Flavored Markdown and smart typography processing.
 *
 * @returns Configured remark processor instance
 */
function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

/**
 * Internal function to parse and combine JSON metadata with markdown reviews.
 * Merges reviewed works data with review markdown content and calculates distinct values.
 *
 * @param reviewedWorksJson - Array of reviewed work metadata from JSON
 * @returns Promise resolving to reviews data with combined metadata
 */
async function parseReviewedWorksJson(
  reviewedWorksJson: ReviewedWorkJson[],
): Promise<Reviews> {
  return await perfLogger.measure("parseReviewedWorksJson", async () => {
    const distinctReviewYears = new Set<string>();
    const distinctWorkYears = new Set<string>();
    const distinctKinds = new Set<string>();

    const reviewsMarkdown =
      cachedMarkdownReviews || (await allReviewsMarkdown());
    if (ENABLE_CACHE && !cachedMarkdownReviews) {
      cachedMarkdownReviews = reviewsMarkdown;
    }

    const reviews = reviewedWorksJson.map((work) => {
      distinctKinds.add(work.kind);
      distinctWorkYears.add(work.workYear);

      const { date, grade, rawContent, synopsis } = reviewsMarkdown.find(
        (reviewsmarkdown) => {
          return reviewsmarkdown.slug === work.slug;
        },
      )!;

      distinctReviewYears.add(work.reviewYear);

      return {
        ...work,
        date,
        grade,
        rawContent,
        synopsis,
      };
    });

    return {
      distinctKinds: [...distinctKinds].toSorted(),
      distinctReviewYears: [...distinctReviewYears].toSorted(),
      distinctWorkYears: [...distinctWorkYears].toSorted(),
      reviews,
    };
  });
}
