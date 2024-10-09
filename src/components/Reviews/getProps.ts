import { getFluidCoverImageProps } from "src/api/covers";
import { allReviews } from "src/api/reviews";
import { ListItemCoverImageConfig } from "src/components/ListItemCover";

import type { ListItemValue, Props } from "./Reviews";

export async function getProps(): Promise<Props> {
  const {
    reviews,
    distinctPublishedYears,
    distinctKinds,
    distinctReviewYears,
  } = await allReviews();

  reviews.sort((a, b) =>
    a.authors[0].sortName.localeCompare(b.authors[0].sortName),
  );

  const values = await Promise.all(
    reviews.map(async (review) => {
      const value: ListItemValue = {
        date: review.date,
        title: review.title,
        slug: review.slug,
        grade: review.grade,
        gradeValue: review.gradeValue,
        sortTitle: review.sortTitle,
        coverImageProps: await getFluidCoverImageProps(
          review,
          ListItemCoverImageConfig,
        ),
        yearPublished: review.yearPublished,
        kind: review.kind,
        authors: review.authors.map((author) => {
          const authorValue: ListItemValue["authors"][0] = {
            name: author.name,
            sortName: author.sortName,
          };

          return authorValue;
        }),
      };

      return value;
    }),
  );

  return {
    deck: `"I intend to put up with nothing that I can put down."`,
    values,
    distinctKinds,
    distinctPublishedYears,
    distinctReviewYears,
    initialSort: "author-asc",
  };
}
