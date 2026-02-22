import type { ReviewData, ReviewedWorkData } from "~/content.config";

import { getFluidCoverImageProps } from "~/api/covers";
import { allReviews, loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { ReviewCardCoverImageConfig } from "~/components/review-card/ReviewCard";

import type { HomeProps } from "./Home";

/**
 * Loads and prepares data for the Home page component.
 * Fetches the most recent reviews, processes their excerpts, and prepares
 * optimized cover images and backdrop for display.
 *
 * @param works - All reviewed work data from the reviewedWorks collection
 * @param reviews - All review data from the reviews collection
 * @returns Promise resolving to Home page props with recent reviews and images
 */
export async function getHomeProps(
  works: ReviewedWorkData[],
  reviews: ReviewData[],
): Promise<HomeProps> {
  const { reviews: allReviewsList } = allReviews(works, reviews);
  const recentReviews = mostRecentReviews(allReviewsList, 12);

  return {
    values: await Promise.all(
      recentReviews.map(async (review) => {
        return {
          ...review,
          coverImageProps: await getFluidCoverImageProps(
            review,
            ReviewCardCoverImageConfig,
          ),
          excerpt: loadExcerptHtml(review),
        };
      }),
    ),
  };
}
