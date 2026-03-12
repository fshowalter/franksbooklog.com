import type { CollectionEntry } from "astro:content";

import { getFluidCoverImageProps } from "~/assets/covers";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { gradeToValue } from "~/utils/grades";
import { toDisplayDate } from "~/utils/toDisplayDate";

import type { AuthorTitlesProps, AuthorTitlesValue } from "./AuthorTitles";

export async function getAuthorTitlesProps(
  reviewedAuthor: CollectionEntry<"reviewedAuthors">["data"],
  reviewedWorks: CollectionEntry<"reviewedWorks">["data"][],
): Promise<AuthorTitlesProps> {
  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<string>();
  const distinctWorkYears = new Set<string>();

  const values = await Promise.all(
    reviewedWorks.map(async (reviewedWork) => {
      distinctKinds.add(reviewedWork.kind);
      distinctReviewYears.add(reviewedWork.reviewDate.getFullYear().toString());
      distinctWorkYears.add(reviewedWork.workYear);

      const value: AuthorTitlesValue = {
        abandoned: reviewedWork.grade === "Abandoned",
        coverImageProps: await getFluidCoverImageProps(
          { slug: reviewedWork.id },
          CoverListItemImageConfig,
        ),
        displayDate: toDisplayDate(reviewedWork.reviewDate),
        grade: reviewedWork.grade,
        gradeValue: gradeToValue(reviewedWork.grade),
        kind: reviewedWork.kind,
        otherAuthors: reviewedWork.authors.filter(
          (a) => a.slug !== reviewedAuthor.slug,
        ),
        reviewDate: reviewedWork.reviewDate,
        reviewed: reviewedWork.grade !== "Abandoned",
        reviewSequence: reviewedWork.reviewSequence,
        reviewYear: reviewedWork.reviewDate.getFullYear().toString(),
        slug: reviewedWork.id,
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
    distinctWorkYears: [...distinctWorkYears].toSorted(),
    initialSort: "title-asc",
    values,
  };
}
