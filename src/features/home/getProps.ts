import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { CoverImageConfig } from "~/components/review-card/ReviewCard";

import type { HomeProps } from "./Home";

export async function getProps(): Promise<HomeProps> {
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
