import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { getPage } from "~/api/pages";
import { mostRecentReviews } from "~/api/reviews";
import { BackdropImageConfig } from "~/components/Backdrop";
import { MoreReviewsImageConfig } from "~/components/MoreReviews";

import type { Props } from "./Article";

export async function getProps({
  deck,
  slug,
}: {
  deck: string;
  slug: string;
}): Promise<Props & { rawContent: string }> {
  const { content, rawContent, title } = await getPage(slug);
  const recentReviews = await mostRecentReviews(6);

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
