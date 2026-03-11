import type { CollectionEntry } from "astro:content";

import { getFluidCoverImageProps } from "~/assets/covers";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { gradeToValue } from "~/utils/grades";
import { toDisplayDate } from "~/utils/toDisplayDate";

import type { ReviewsProps, ReviewsValue } from "./Reviews";

export async function getReviewsProps(
  reviewedWorks: CollectionEntry<"reviewedWorks">["data"][],
): Promise<ReviewsProps> {
  reviewedWorks.sort((a, b) =>
    a.authors[0].sortName.localeCompare(b.authors[0].sortName),
  );

  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<number>();
  const distinctWorkYears = new Set<string>();

  const values = await Promise.all(
    reviewedWorks.map(async (reviewedWork) => {
      distinctKinds.add(reviewedWork.kind);
      distinctReviewYears.add(reviewedWork.reviewDate.getFullYear());
      distinctWorkYears.add(reviewedWork.workYear);

      const value: ReviewsValue = {
        abandoned: reviewedWork.grade === "Abandoned",
        authors: reviewedWork.authors.map((author) => {
          const authorValue: ReviewsValue["authors"][number] = {
            name: author.name,
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
        reviewYear: reviewedWork.reviewDate.getFullYear().toString(),
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
    distinctReviewYears: [...distinctReviewYears]
      .map((year) => year.toString())
      .toSorted(),
    distinctWorkYears: [...distinctWorkYears].toSorted(),
    initialSort: "author-asc",
    values,
  };
}
