import {
  getFixedCoverImageProps,
  getFluidCoverImageProps,
  getStructuredDataCoverSrc,
} from "~/api/covers";
import { allReviews, loadContent } from "~/api/reviews";
import { MoreReviewsImageConfig } from "~/components/MoreReviews";

import { CoverImageConfig, type Props } from "./Review";

export async function getProps(slug: string): Promise<Props> {
  const { reviews } = await allReviews();

  const baseReview = reviews.find((review) => {
    return review.slug === slug;
  })!;

  const reviewWithContent = await loadContent(baseReview);

  return {
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
    structuredDataCoverSrc: await getStructuredDataCoverSrc(reviewWithContent),
    value: reviewWithContent,
  };
}
