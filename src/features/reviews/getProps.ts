import {
  type BackdropImageProps,
  getBackdropImageProps,
} from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { allReviews } from "~/api/reviews";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { ReviewsProps, ReviewsValue } from "./Reviews";

type Props = ReviewsProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

export async function getProps(): Promise<Props> {
  const { distinctKinds, distinctReviewYears, distinctWorkYears, reviews } =
    await allReviews();

  reviews.sort((a, b) =>
    a.authors[0].sortName.localeCompare(b.authors[0].sortName),
  );

  const values = await Promise.all(
    reviews.map(async (review) => {
      const value: ReviewsValue = {
        authors: review.authors.map((author) => {
          const authorValue: ReviewsValue["authors"][number] = {
            name: author.name,
            sortName: author.sortName,
          };

          return authorValue;
        }),
        authorSequence: review.authorSequence,
        coverImageProps: await getFluidCoverImageProps(
          review,
          CoverListItemImageConfig,
        ),
        displayDate: displayDate(review.date),
        grade: review.grade,
        gradeValue: review.gradeValue,
        kind: review.kind,
        reviewSequence: review.reviewSequence,
        reviewYear: review.reviewYear,
        slug: review.slug,
        sortTitle: review.sortTitle,
        title: review.title,
        workYear: review.workYear,
        workYearSequence: review.workYearSequence,
      };

      return value;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "reviews",
      BackdropImageConfig,
    ),
    deck: `"You were always the best of them, Lloyd."`,
    distinctKinds,
    distinctReviewYears,
    distinctWorkYears,
    initialSort: "author-asc",
    values,
  };
}
