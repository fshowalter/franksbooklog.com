import type {
  AuthorData,
  ReadingData,
  ReviewData,
  WorkData,
} from "~/content.config";

import { getFluidCoverImageProps } from "~/api/covers";
import { allReviews } from "~/api/reviews";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { ReviewsProps, ReviewsValue } from "./Reviews";

/**
 * Loads and prepares data for the Reviews page component.
 * Joins works, reviews, authors, and readings collections; sorts by author name;
 * and prepares optimized cover images for the reviews listing page.
 *
 * @param works - All work data from the works collection
 * @param reviews - All review data from the reviews collection
 * @param authors - All author data from the authors collection
 * @param readings - All reading data from the readings collection
 * @returns Promise resolving to Reviews page props with all review data and filtering metadata
 */
export async function getReviewsProps(
  works: WorkData[],
  reviews: ReviewData[],
  authors: AuthorData[],
  readings: ReadingData[],
): Promise<ReviewsProps> {
  const {
    distinctKinds,
    distinctReviewYears,
    distinctWorkYears,
    reviews: allReviewsList,
  } = allReviews(works, reviews, authors, readings);

  allReviewsList.sort((a, b) =>
    a.authors[0].sortName.localeCompare(b.authors[0].sortName),
  );

  const values = await Promise.all(
    allReviewsList.map(async (review) => {
      const value: ReviewsValue = {
        abandoned: review.abandoned,
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
        reviewed: !review.abandoned,
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
