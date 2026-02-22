import type { ReviewData, ReviewedWorkData } from "~/content.config";

import { getFluidCoverImageProps } from "~/api/covers";
import { allReviews, loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { ReviewCardCoverImageConfig } from "~/components/review-card/ReviewCard";

import type { ArticleProps } from "./Article";

/**
 * Gets props for the Article component by loading page content and recent reviews.
 * Fetches the page content, backdrop image, and recent reviews with cover images
 * to populate the article page.
 *
 * @param params - The parameters for fetching article props
 * @param params.content - The article content HTML string
 * @param params.works - All reviewed work data from the reviewedWorks collection
 * @param params.reviews - All review data from the reviews collection
 * @returns Promise resolving to article props including content and recent reviews
 */
export async function getArticleProps({
  content,
  reviews,
  works,
}: {
  content?: string;
  reviews: ReviewData[];
  works: ReviewedWorkData[];
}): Promise<ArticleProps> {
  const { reviews: allReviewsList } = allReviews(works, reviews);
  const recentWorks = mostRecentReviews(allReviewsList, 6);

  return {
    content,
    recentReviews: await Promise.all(
      recentWorks.map(async (review) => {
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
