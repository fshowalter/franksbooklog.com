import type { AuthorData, ReadingData, ReviewData, WorkData } from "~/content.config";

import { getFluidCoverImageProps } from "~/api/covers";
import { allReviews, loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { ReviewCardCoverImageConfig } from "~/components/review-card/ReviewCard";

import type { HomeProps } from "./Home";

/**
 * Loads and prepares data for the Home page component.
 * Fetches the most recent reviews, processes their excerpts, and prepares
 * optimized cover images for display.
 *
 * @param works - All work data from the works collection
 * @param reviews - All review data from the reviews collection
 * @param authors - All author data from the authors collection
 * @param readings - All reading data from the readings collection
 * @returns Promise resolving to Home page props with recent reviews and images
 */
export async function getHomeProps(
  works: WorkData[],
  reviews: ReviewData[],
  authors: AuthorData[],
  readings: ReadingData[],
): Promise<HomeProps> {
  const { reviews: allReviewsList } = allReviews(works, reviews, authors, readings);
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
