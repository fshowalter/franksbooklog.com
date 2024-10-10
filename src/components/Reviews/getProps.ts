import { getFluidCoverImageProps } from "~/api/covers";
import { allReviews } from "~/api/reviews";
import { ListItemCoverImageConfig } from "~/components/ListItemCover";

import type { ListItemValue, Props } from "./Reviews";

export async function getProps(): Promise<Props> {
  const {
    distinctKinds,
    distinctPublishedYears,
    distinctReviewYears,
    reviews,
  } = await allReviews();

  reviews.sort((a, b) =>
    a.authors[0].sortName.localeCompare(b.authors[0].sortName),
  );

  const values = await Promise.all(
    reviews.map(async (review) => {
      const value: ListItemValue = {
        authors: review.authors.map((author) => {
          const authorValue: ListItemValue["authors"][0] = {
            name: author.name,
            sortName: author.sortName,
          };

          return authorValue;
        }),
        coverImageProps: await getFluidCoverImageProps(
          review,
          ListItemCoverImageConfig,
        ),
        date: review.date,
        grade: review.grade,
        gradeValue: review.gradeValue,
        kind: review.kind,
        slug: review.slug,
        sortTitle: review.sortTitle,
        title: review.title,
        yearPublished: review.yearPublished,
      };

      return value;
    }),
  );

  return {
    deck: `"I intend to put up with nothing that I can put down."`,
    distinctKinds,
    distinctPublishedYears,
    distinctReviewYears,
    initialSort: "author-asc",
    values,
  };
}
