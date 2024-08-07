import { getFixedCoverImageProps } from "src/api/covers";
import { loadExcerptHtml, mostRecentReviews } from "src/api/reviews";

import type { Props } from "./Home";
import { CoverImageConfig } from "./HomeListItem";

export async function getProps(): Promise<Props> {
  const works = await mostRecentReviews(10);

  const reviews = await Promise.all(
    works.map(async (review) => {
      return await loadExcerptHtml(review);
    }),
  );

  return {
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
