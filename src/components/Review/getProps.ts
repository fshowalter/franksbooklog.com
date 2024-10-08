import {
  getFixedCoverImageProps,
  getFluidCoverImageProps,
  getStructuredDataCoverSrc,
} from "src/api/covers";
import { allReviews, loadContent } from "src/api/reviews";

import { MoreReviewsImageConfig } from "../MoreReviews";
import { CoverImageConfig, type Props } from "./Review";

export async function getProps(slug: string): Promise<Props> {
  const { reviews } = await allReviews();

  const baseReview = reviews.find((review) => {
    return review.slug === slug;
  })!;

  const reviewWithContent = await loadContent(baseReview);

  return {
    structuredDataCoverSrc: await getStructuredDataCoverSrc(reviewWithContent),
    value: reviewWithContent,
    coverImageProps: await getFixedCoverImageProps(
      reviewWithContent,
      CoverImageConfig,
    ),
    moreReviews: await Promise.all(
      reviewWithContent.moreReviews.map(async (review) => {
        return {
          ...review,
          coverImageProps: await getFluidCoverImageProps(
            review,
            MoreReviewsImageConfig,
          ),
        };
      }),
    ),
  };
}
