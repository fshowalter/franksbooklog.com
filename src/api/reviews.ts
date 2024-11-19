import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import type { MarkdownReading } from "./data/readingsMarkdown";
import type {
  ReviewedWorkJson,
  ReviewedWorkJsonReading,
} from "./data/reviewedWorksJson";
import type { MarkdownReview } from "./data/reviewsMarkdown";

import { allReadingsMarkdown } from "./data/readingsMarkdown";
import { allReviewedWorksJson } from "./data/reviewedWorksJson";
import { allReviewsMarkdown } from "./data/reviewsMarkdown";
import { linkReviewedWorks } from "./utils/linkReviewedWorks";
import { getHtml } from "./utils/markdown/getHtml";
import { removeFootnotes } from "./utils/markdown/removeFootnotes";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";
import {
  EXCERPT_SEPARATOR,
  trimToExcerpt,
} from "./utils/markdown/trimToExcerpt";

let cachedReadingsMarkdown: MarkdownReading[];
let cachedMarkdownReviews: MarkdownReview[];
let cachedReviewedWorksJson: ReviewedWorkJson[];
let cachedReviews: Reviews;

if (import.meta.env.MODE !== "development") {
  cachedReadingsMarkdown = await allReadingsMarkdown();
  cachedReviewedWorksJson = await allReviewedWorksJson();
  cachedMarkdownReviews = await allReviewsMarkdown();
}

export type Review = {} & MarkdownReview & ReviewedWorkJson;

export type ReviewWithContent = {
  content: string | undefined;
  excerptPlainText: string;
  readings: ReviewReading[];
} & Review;

export type ReviewWithExcerpt = {
  excerpt: string;
} & Review;

type ReviewReading = {
  editionNotes: string | undefined;
  readingNotes: string | undefined;
} & MarkdownReading &
  ReviewedWorkJsonReading;

type Reviews = {
  distinctKinds: string[];
  distinctPublishedYears: string[];
  distinctReviewYears: string[];
  reviews: Review[];
};

export async function allReviews(): Promise<Reviews> {
  if (cachedReviews) {
    return cachedReviews;
  }
  const reviewedWorksJson =
    cachedReviewedWorksJson || (await allReviewedWorksJson());
  const reviews = await parseReviewedWorksJson(reviewedWorksJson);

  if (!import.meta.env.DEV) {
    cachedReviews = reviews;
  }

  return reviews;
}

export async function loadContent(review: Review): Promise<ReviewWithContent> {
  const readingsMarkdown =
    cachedReadingsMarkdown || (await allReadingsMarkdown());
  const reviewedWorksJson = await allReviewedWorksJson();

  const excerptPlainText = getMastProcessor()
    .use(removeFootnotes)
    .use(trimToExcerpt)
    .use(strip)
    .processSync(review.rawContent)
    .toString();

  const readings = review.readings.map((reading) => {
    const markdownReading = readingsMarkdown.find((markdownReading) => {
      return markdownReading.sequence === reading.sequence;
    })!;

    return {
      ...reading,
      ...markdownReading,
      editionNotes: getHtmlAsSpan(
        markdownReading.editionNotesRaw,
        reviewedWorksJson,
      ),
      readingNotes: getHtml(markdownReading.readingNotesRaw, reviewedWorksJson),
    };
  });

  if (readings.length === 0) {
    throw new Error(`No markdown readings found with work_slug ${review.slug}`);
  }

  return {
    ...review,
    content: getHtml(review.rawContent, reviewedWorksJson),
    excerptPlainText,
    readings,
  };
}

export async function loadExcerptHtml(
  review: Review,
): Promise<ReviewWithExcerpt> {
  const reviewsMarkdown = cachedMarkdownReviews || (await allReviewsMarkdown());
  const reviewedWorksJson =
    cachedReviewedWorksJson || (await allReviewedWorksJson());

  const { rawContent } = reviewsMarkdown.find((markdown) => {
    return markdown.slug === review.slug;
  })!;

  let excerptHtml = getMastProcessor()
    .use(removeFootnotes)
    .use(trimToExcerpt)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .processSync(rawContent)
    .toString();

  const hasExcerptBreak = rawContent.includes(EXCERPT_SEPARATOR);

  if (hasExcerptBreak) {
    excerptHtml = excerptHtml.replace(/\n+$/, "");
    excerptHtml = excerptHtml.replace(
      /<\/p>$/,
      ` <a class="!no-underline uppercase whitespace-nowrap text-accent text-sm leading-none" href="/reviews/${review.slug}/">Continue reading...</a></p>`,
    );
  }

  return {
    ...review,
    excerpt: linkReviewedWorks(excerptHtml, reviewedWorksJson),
  };
}

export async function mostRecentReviews(limit: number) {
  const reviewedWorksJson =
    cachedReviewedWorksJson || (await allReviewedWorksJson());

  reviewedWorksJson.sort((a, b) => b.sequence - a.sequence);
  const slicedWorks = reviewedWorksJson.slice(0, limit);

  const { reviews } = await parseReviewedWorksJson(slicedWorks);

  return reviews;
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
  const distinctReviewYears = new Set<string>();
  const distinctPublishedYears = new Set<string>();
  const distinctKinds = new Set<string>();
  const reviewsMarkdown = cachedMarkdownReviews || (await allReviewsMarkdown());

  const reviews = reviewedWorksJson.map((work) => {
    distinctKinds.add(work.kind);
    distinctPublishedYears.add(work.yearPublished);

    const { date, grade, rawContent } = reviewsMarkdown.find(
      (reviewsmarkdown) => {
        return reviewsmarkdown.slug === work.slug;
      },
    )!;

    distinctReviewYears.add(
      date.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
      }),
    );

    return {
      ...work,
      date,
      grade,
      rawContent,
    };
  });

  return {
    distinctKinds: [...distinctKinds].toSorted(),
    distinctPublishedYears: [...distinctPublishedYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    reviews,
  };
}
