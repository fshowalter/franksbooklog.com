import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { getPage } from "~/api/pages";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { MoreReviewsImageConfig } from "~/components/more-reviews/MoreReviews";

import type { Props } from "./Article";

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
export async function getProps({
  deck,
  slug,
}: {
  deck: string;
  slug: string;
}): Promise<Props & { rawContent: string }> {
  const { content, rawContent, title } = await getPage(slug);

  const works = await mostRecentReviews(6);

  const recentReviews = await Promise.all(
    works.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(slug, BackdropImageConfig),
    content,
    deck,
    rawContent,
    recentReviews: await Promise.all(
      recentReviews.map(async (review) => {
        return {
          ...review,
          coverImageProps: await getFluidCoverImageProps(
            review,
            MoreReviewsImageConfig,
          ),
        };
      }),
    ),
    title,
  };
}
