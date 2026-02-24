import { getCollection, getEntry } from "astro:content";

import type {
  AuthorData,
  ReadingData,
  ReviewData,
  WorkData,
} from "~/content.config";

import type { Review } from "~/api/reviews";

import {
  getFixedCoverImageProps,
  getFluidCoverImageProps,
  getStructuredDataCoverSrc,
} from "~/api/covers";
import type { IncludedWork } from "~/api/reviews";
import { loadContent, loadExcerptHtml } from "~/api/reviews";
import { ReviewCardCoverImageConfig } from "~/components/review-card/ReviewCard";

import type { ReviewProps } from "./Review";

import { CoverImageConfig } from "./Review";

// AIDEV-NOTE: reviewSequence for moreReview cards — same logic as allReviews():
// slug of the most recent reading for the work, or "" if no readings exist.

export async function getReviewProps(
  baseReview: Review,
): Promise<ReviewProps> {
  const [readingsEntries, worksEntries, authorsEntries, reviewsEntries] =
    await Promise.all([
      getCollection("readings"),
      getCollection("works"),
      getCollection("authors"),
      getCollection("reviews"),
    ]);

  const readings = readingsEntries.map((e) => e.data);
  const authors = authorsEntries.map((e) => e.data);
  const reviews = reviewsEntries.map((e) => e.data);

  const worksMap = new Map<string, WorkData>(worksEntries.map((e) => [e.id, e.data]));
  const authorsMap = new Map<string, AuthorData>(authors.map((a) => [a.slug, a]));
  const reviewsMap = new Map<string, ReviewData>(reviews.map((r) => [r.slug.id, r]));

  // Group readings by workSlug for reviewSequence computation on moreReview cards
  const readingsByWork = new Map<string, ReadingData[]>();
  for (const entry of readingsEntries) {
    const list = readingsByWork.get(entry.data.workSlug) ?? [];
    list.push(entry.data);
    readingsByWork.set(entry.data.workSlug, list);
  }

  // Enrich includedWorks — plain slugs from WorkData, resolved to full objects
  const reviewedSlugs = new Set(reviews.map((r) => r.slug.id));
  const enrichedIncludedWorks: IncludedWork[] = baseReview.includedWorks
    .map((slug) => {
      const work = worksMap.get(slug);
      if (!work) return;
      const reviewData = reviewsMap.get(slug);
      return {
        authors: work.authors.map((a) => ({
          name: authorsMap.get(a.slug)?.name ?? a.slug,
          slug: a.slug,
        })),
        grade: reviewData?.grade,
        kind: work.kind,
        reviewed: reviewedSlugs.has(slug),
        slug,
        title: work.title,
        workYear: work.workYear,
      };
    })
    .filter((w): w is IncludedWork => w !== undefined);

  const reviewWithContent = loadContent(
    baseReview,
    readings,
    reviews,
    enrichedIncludedWorks,
  );

  // Resolve moreReviews from moreForReviewedWorks collection
  const moreForWork = await getEntry("moreForReviewedWorks", baseReview.slug);
  const moreReviewSlugs = moreForWork?.data.moreReviews ?? [];

  const resolvedMoreReviews = moreReviewSlugs
    .map((slug) => {
      const moreWork = worksMap.get(slug);
      const moreReviewData = reviewsMap.get(slug);
      if (!moreWork || !moreReviewData) return;
      return { moreReviewData, moreWork };
    })
    .filter(
      (
        item,
      ): item is { moreReviewData: ReviewData; moreWork: WorkData } =>
        item !== undefined,
    );

  return {
    coverImageProps: await getFixedCoverImageProps(
      reviewWithContent,
      CoverImageConfig,
    ),
    moreReviews: await Promise.all(
      resolvedMoreReviews.map(async ({ moreReviewData, moreWork }) => {
        const excerpt = loadExcerptHtml(moreReviewData);
        const enrichedAuthors = moreWork.authors.map((a) => ({
          name: authorsMap.get(a.slug)?.name ?? a.slug,
        }));
        return {
          authors: enrichedAuthors,
          coverImageProps: await getFluidCoverImageProps(
            { slug: moreWork.slug },
            ReviewCardCoverImageConfig,
          ),
          excerpt,
          grade: moreReviewData.grade,
          kind: moreWork.kind,
          reviewDate: undefined,
          reviewSequence: getMostRecentReadingSlug(moreWork.slug, readingsByWork),
          slug: moreWork.slug,
          title: moreWork.title,
          workYear: moreWork.workYear,
        };
      }),
    ),
    structuredDataCoverSrc: await getStructuredDataCoverSrc(reviewWithContent),
    value: reviewWithContent,
  };
}

function getMostRecentReadingSlug(
  workSlug: string,
  readingsByWork: Map<string, ReadingData[]>,
): string {
  const readings = readingsByWork.get(workSlug) ?? [];
  if (readings.length === 0) return "";
  return readings.toSorted((a, b) => b.date.getTime() - a.date.getTime())[0]
    .slug;
}
