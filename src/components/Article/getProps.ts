import { getBackdropImageProps } from "src/api/backdrops";
import { getFluidCoverImageProps } from "src/api/covers";
import { getPage } from "src/api/pages";
import { mostRecentReviews } from "src/api/reviews";
import { CoverGalleryListItemImageConfig } from "src/components/CoverGalleryListItem";

import type { Props } from "./Article";
import { BackdropImageConfig } from "./Article";

export async function getProps({
  slug,
  alt,
}: {
  slug: string;
  alt: string;
}): Promise<Props> {
  const { title, content } = await getPage(slug);
  const recentReviews = await mostRecentReviews(4);

  return {
    title,
    content,
    alt,
    backdropImageProps: await getBackdropImageProps(slug, BackdropImageConfig),
    recentReviews: await Promise.all(
      recentReviews.map(async (review) => {
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
