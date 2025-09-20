import {
  getFixedCoverImageProps,
  getFluidCoverImageProps,
  getStructuredDataCoverSrc,
} from "~/api/covers";
import { loadContent, loadExcerptHtml, type Review } from "~/api/reviews";
import { ReviewCardCoverImageConfig } from "~/components/review-card/ReviewCard";

import { CoverImageConfig, type ReviewProps } from "./Review";

export async function getReviewProps(baseReview: Review): Promise<ReviewProps> {
  const reviewWithContent = await loadContent(baseReview);

  return {
    coverImageProps: await getFixedCoverImageProps(
      reviewWithContent,
      CoverImageConfig,
    ),
    moreReviews: await Promise.all(
      reviewWithContent.moreReviews.map(async (review) => {
        const reviewWithExcerpt = await loadExcerptHtml(review);
        return {
          ...reviewWithExcerpt,
          coverImageProps: await getFluidCoverImageProps(
            reviewWithExcerpt,
            ReviewCardCoverImageConfig,
          ),
          reviewDate: undefined,
        };
      }),
    ),
    structuredDataCoverSrc: await getStructuredDataCoverSrc(reviewWithContent),
    value: reviewWithContent,
  };
}
