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

export type Review = MarkdownReview & ReviewedWorkJson & {};

export type ReviewWithContent = Omit<Review, "readings"> & {
  content: string | undefined;
  excerptPlainText: string;
  readings: ReviewReading[];
};

export type ReviewWithExcerpt = Review & {
  excerpt: string;
};

type ReviewExcerpt = {
  excerpt: string;
};

type ReviewReading = MarkdownReading &
  ReviewedWorkJsonReading & {
    editionNotes: string | undefined;
    readingNotes: string | undefined;
  };

type Reviews = {
  distinctKinds: string[];
  distinctReviewYears: string[];
  distinctWorkYears: string[];
  reviews: Review[];
};

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

export function getContentPlainText(rawContent: string): string {
  return getMastProcessor()
    .use(removeFootnotes)
    .use(strip)
    .processSync(rawContent)
    .toString();
}

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
      })
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

export async function mostRecentReviews(limit: number) {
  return await perfLogger.measure("mostRecentReviews", async () => {
    const reviewedWorksJson =
      cachedReviewedWorksJson || (await allReviewedWorksJson());
    if (ENABLE_CACHE && !cachedReviewedWorksJson) {
      cachedReviewedWorksJson = reviewedWorksJson;
    }

    reviewedWorksJson.sort((a, b) => b.reviewSequence - a.reviewSequence);
    const slicedWorks = reviewedWorksJson.slice(0, limit);

    const { reviews } = await parseReviewedWorksJson(slicedWorks);

    return reviews;
  });
}

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

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}

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
