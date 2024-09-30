import { getBackdropImageProps } from "src/api/backdrops";
import { getFixedCoverImageProps } from "src/api/covers";
import { loadExcerptHtml, mostRecentReviews } from "src/api/reviews";

import { BackdropImageConfig } from "../Backdrop";
import type { Props } from "./Home";
import { CoverImageConfig } from "./HomeListItem";

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
    values: await Promise.all(
      reviews.map(async (review) => {
        return {
          ...review,
          coverImageProps: await getFixedCoverImageProps(
            review,
            CoverImageConfig,
          ),
        };
      }),
    ),
  };
}
