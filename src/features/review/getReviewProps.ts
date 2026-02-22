import type { Review } from "~/api/reviews";
import type { ReadingData, ReviewData, ReviewedWorkData } from "~/content.config";

import {
  getFixedCoverImageProps,
  getFluidCoverImageProps,
  getStructuredDataCoverSrc,
} from "~/api/covers";
import { loadContent, loadExcerptHtml } from "~/api/reviews";
import { ReviewCardCoverImageConfig } from "~/components/review-card/ReviewCard";

import type { ReviewProps } from "./Review";

import { CoverImageConfig } from "./Review";

export async function getReviewProps(
  baseReview: Review,
  readings: ReadingData[],
  reviewedWorks: ReviewedWorkData[],
  reviews: ReviewData[],
): Promise<ReviewProps> {
  const reviewWithContent = loadContent(baseReview, readings, reviewedWorks);

  // moreReviews are { collection, id }[] references — resolve to full work+review objects
  const resolvedMoreReviews = reviewWithContent.moreReviews
    .map((ref) => {
      const moreWork = reviewedWorks.find((w) => w.slug === ref.id);
      const moreReviewData = reviews.find((r) => r.work_slug.id === ref.id);
      if (!moreWork || !moreReviewData) return;
      return { moreReviewData, moreWork };
    })
    .filter(
      (
        item,
      ): item is { moreReviewData: ReviewData; moreWork: ReviewedWorkData } =>
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
        return {
          authors: moreWork.authors,
          coverImageProps: await getFluidCoverImageProps(
            moreWork,
            ReviewCardCoverImageConfig,
          ),
          excerpt,
          grade: moreWork.grade,
          kind: moreWork.kind,
          reviewDate: undefined,
          reviewSequence: moreWork.reviewSequence,
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
