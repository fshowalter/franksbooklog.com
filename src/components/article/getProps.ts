import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { getPage } from "~/api/pages";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { MoreReviewsImageConfig } from "~/components/more-reviews/MoreReviews";

import type { Props } from "./Article";

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
