import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { BackdropImageConfig } from "~/components/Backdrop";
import { CoverImageConfig } from "~/components/ReviewCardWithExcerpt";

import type { Props } from "./Home";

export async function getProps(): Promise<Props> {
  const works = await mostRecentReviews(12);

  const reviews = await Promise.all(
    works.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "home",
      BackdropImageConfig,
    ),
    deck: "Literature is a relative term.",
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
