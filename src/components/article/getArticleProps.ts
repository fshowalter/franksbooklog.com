import { getFluidCoverImageProps } from "~/api/covers";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { ReviewCardCoverImageConfig } from "~/components/review-card/ReviewCard";

import type { ArticleProps } from "./Article";

/**
 * Gets props for the Article component by loading page content and recent reviews.
 * Fetches the page content, backdrop image, and recent reviews with cover images
 * to populate the article page.
 *
 * @param params - The parameters for fetching article props
 * @param params.deck - The article subtitle/description
 * @param params.slug - The page slug to load content for
 * @returns Promise resolving to article props including content and recent reviews
 */
export async function getArticleProps({
  content,
}: {
  content?: string;
}): Promise<ArticleProps> {
  const works = await mostRecentReviews(6);

  const recentReviews = await Promise.all(
    works.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return {
    content,
    recentReviews: await Promise.all(
      recentReviews.map(async (review) => {
        return {
          ...review,
          coverImageProps: await getFluidCoverImageProps(
            review,
            ReviewCardCoverImageConfig,
          ),
        };
      }),
    ),
  };
}
