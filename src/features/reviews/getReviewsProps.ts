import type { CollectionEntry } from "astro:content";

import { getFluidCoverImageProps } from "~/assets/covers";
import { CoverListItemImageConfig } from "~/components/react/cover-list/CoverListItem";
import { gradeToValue } from "~/utils/grades";
import { toDisplayDate } from "~/utils/toDisplayDate";
import { toSortYear } from "~/utils/toSortYear";

import type { ReviewsProps, ReviewsValue } from "./Reviews";

export async function getReviewsProps(
  reviewedTitles: CollectionEntry<"reviewedTitles">["data"][],
): Promise<ReviewsProps> {
  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<string>();
  const distinctTitleYears = new Set<string>();

  const values = await Promise.all(
    reviewedTitles.map(async (reviewedTitle) => {
      distinctKinds.add(reviewedTitle.kind);
      distinctReviewYears.add(toSortYear(reviewedTitle.reviewDate));
      distinctTitleYears.add(reviewedTitle.titleYear);

      const value: ReviewsValue = {
        abandoned: reviewedTitle.grade === "Abandoned",
        authors: reviewedTitle.authors.map((author) => {
          const authorValue: ReviewsValue["authors"][number] = {
            name: author.name,
            notes: author.notes,
            sortName: author.sortName,
          };

          return authorValue;
        }),
        coverImageProps: await getFluidCoverImageProps(
          { slug: reviewedTitle.id },
          CoverListItemImageConfig,
        ),
        displayDate: toDisplayDate(reviewedTitle.reviewDate),
        grade: reviewedTitle.grade,
        gradeValue: gradeToValue(reviewedTitle.grade),
        kind: reviewedTitle.kind,
        reviewSequence: reviewedTitle.reviewSequence,
        reviewYear: toSortYear(reviewedTitle.reviewDate),
        slug: reviewedTitle.review.id,
        sortTitle: reviewedTitle.sortTitle,
        title: reviewedTitle.title,
        titleYear: reviewedTitle.titleYear,
      };

      return value;
    }),
  );

  return {
    distinctKinds: [...distinctKinds].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    distinctTitleYears: [...distinctTitleYears].toSorted(),
    initialSort: "author-asc",
    values,
  };
}
