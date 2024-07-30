import {
  getFixedCoverImageProps,
  getFluidCoverImageProps,
  getOpenGraphCoverSrc,
} from "src/api/covers";
import { allReviews, loadContent } from "src/api/reviews";

import { CoverGalleryListItemImageConfig } from "../CoverGalleryListItem";
import { CoverImageConfig, type Props } from "./Review";

export async function getProps(slug: string): Promise<Props> {
  const { reviews } = await allReviews();

  const baseReview = reviews.find((review) => {
    return review.slug === slug;
  })!;

  const reviewWithContent = await loadContent(baseReview);

  return {
    value: reviewWithContent,
    seoImageSrc: await getOpenGraphCoverSrc(reviewWithContent),
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
            CoverGalleryListItemImageConfig,
          ),
        };
      }),
    ),
  };
}
