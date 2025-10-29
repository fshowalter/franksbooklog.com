import { getFluidCoverImageProps } from "~/api/covers";
import { allReviews } from "~/api/reviews";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { ReviewsProps, ReviewsValue } from "./Reviews";

/**
 * Loads and prepares data for the Reviews page component.
 * Fetches all reviews with metadata, sorts by author name, and prepares
 * optimized cover images and backdrop for the reviews listing page.
 *
 * @returns Promise resolving to Reviews page props with all review data and filtering metadata
 */
export async function getReviewsProps(): Promise<ReviewsProps> {
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
      };

      return value;
    }),
  );

  return {
    distinctKinds,
    distinctReviewYears,
    distinctWorkYears,
    initialSort: "author-asc",
    values,
  };
}
