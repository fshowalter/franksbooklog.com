import { getFluidCoverImageProps } from "~/api/covers";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { CoverImageConfig } from "~/components/review-card/ReviewCard";

import type { HomeProps } from "./Home";

/**
 * Loads and prepares data for the Home page component.
 * Fetches the most recent reviews, processes their excerpts, and prepares
 * optimized cover images and backdrop for display.
 *
 * @returns Promise resolving to Home page props with recent reviews and images
 */
export async function getHomeProps(): Promise<HomeProps> {
  const works = await mostRecentReviews(12);

  const reviews = await Promise.all(
    works.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return {
    values: await Promise.all(
      reviews.map(async (review) => {
        return {
          ...review,
          coverImageProps: await getFluidCoverImageProps(
            review,
            CoverImageConfig,
          ),
        };
      }),
    ),
  };
}
