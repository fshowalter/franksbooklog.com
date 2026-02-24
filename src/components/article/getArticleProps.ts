import type { AuthorData, ReadingData, ReviewData, WorkData } from "~/content.config";

import { getFluidCoverImageProps } from "~/api/covers";
import { allReviews, loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { ReviewCardCoverImageConfig } from "~/components/review-card/ReviewCard";

import type { ArticleProps } from "./Article";

/**
 * Gets props for the Article component by loading page content and recent reviews.
 * Fetches the page content and recent reviews with cover images.
 *
 * @param params - The parameters for fetching article props
 * @param params.content - The article content HTML string
 * @param params.works - All work data from the works collection
 * @param params.reviews - All review data from the reviews collection
 * @param params.authors - All author data from the authors collection
 * @param params.readings - All reading data from the readings collection
 * @returns Promise resolving to article props including content and recent reviews
 */
export async function getArticleProps({
  authors,
  content,
  readings,
  reviews,
  works,
}: {
  authors: AuthorData[];
  content?: string;
  readings: ReadingData[];
  reviews: ReviewData[];
  works: WorkData[];
}): Promise<ArticleProps> {
  const { reviews: allReviewsList } = allReviews(works, reviews, authors, readings);
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
