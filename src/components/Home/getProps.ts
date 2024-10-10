import { getFluidCoverImageProps } from "~/api/covers";
import { loadExcerptHtml, mostRecentReviews } from "~/api/reviews";

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
