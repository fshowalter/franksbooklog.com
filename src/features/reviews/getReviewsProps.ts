import type { CollectionEntry } from "astro:content";

import { getFluidCoverImageProps } from "~/assets/covers";
import { CoverListItemImageConfig } from "~/components/react/cover-list/CoverListItem";
import { gradeToValue } from "~/utils/grades";
import { toDisplayDate } from "~/utils/toDisplayDate";
import { toSortYear } from "~/utils/toSortYear";

import type { ReviewsProps, ReviewsValue } from "./Reviews";

export async function getReviewsProps(
  reviewedWorks: CollectionEntry<"reviewedWorks">["data"][],
): Promise<ReviewsProps> {
  reviewedWorks.sort((a, b) =>
    a.authors[0].sortName.localeCompare(b.authors[0].sortName),
  );

  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<string>();
  const distinctTitleYears = new Set<string>();

  const values = await Promise.all(
    reviewedWorks.map(async (reviewedWork) => {
      distinctKinds.add(reviewedWork.kind);
      distinctReviewYears.add(toSortYear(reviewedWork.reviewDate));
      distinctTitleYears.add(reviewedWork.workYear);

      const value: ReviewsValue = {
        abandoned: reviewedWork.grade === "Abandoned",
        authors: reviewedWork.authors.map((author) => {
          const authorValue: ReviewsValue["authors"][number] = {
            name: author.name,
            notes: author.notes,
            sortName: author.sortName,
          };

          return authorValue;
        }),
        coverImageProps: await getFluidCoverImageProps(
          { slug: reviewedWork.id },
          CoverListItemImageConfig,
        ),
        displayDate: toDisplayDate(reviewedWork.reviewDate),
        grade: reviewedWork.grade,
        gradeValue: gradeToValue(reviewedWork.grade),
        kind: reviewedWork.kind,
        reviewSequence: reviewedWork.reviewSequence,
        reviewYear: toSortYear(reviewedWork.reviewDate),
        slug: reviewedWork.review.id,
        sortTitle: reviewedWork.sortTitle,
        title: reviewedWork.title,
        workYear: reviewedWork.workYear,
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
