import type { CollectionEntry } from "astro:content";

import { getFluidCoverImageProps } from "~/assets/covers";
import { CoverListItemImageConfig } from "~/components/react/cover-list/CoverListItem";
import { gradeToValue } from "~/utils/grades";
import { toDisplayDate } from "~/utils/toDisplayDate";

import type { AuthorTitlesProps, AuthorTitlesValue } from "./AuthorTitles";

export async function getAuthorTitlesProps(
  reviewedAuthor: CollectionEntry<"reviewedAuthors">["data"],
  reviewedTitles: CollectionEntry<"reviewedTitles">["data"][],
): Promise<AuthorTitlesProps> {
  const distinctKinds = new Set<string>();
  const distinctReviewYears = new Set<string>();
  const distinctTitleYears = new Set<string>();

  const values = await Promise.all(
    reviewedTitles.map(async (reviewedTitle) => {
      distinctKinds.add(reviewedTitle.kind);
      distinctReviewYears.add(
        reviewedTitle.reviewDate.getFullYear().toString(),
      );
      distinctTitleYears.add(reviewedTitle.titleYear);

      const value: AuthorTitlesValue = {
        abandoned: reviewedTitle.grade === "Abandoned",
        coverImageProps: await getFluidCoverImageProps(
          { slug: reviewedTitle.id },
          CoverListItemImageConfig,
        ),
        displayDate: toDisplayDate(reviewedTitle.reviewDate),
        grade: reviewedTitle.grade,
        gradeValue: gradeToValue(reviewedTitle.grade),
        kind: reviewedTitle.kind,
        otherAuthors: reviewedTitle.authors.filter(
          (a) => a.slug !== reviewedAuthor.slug,
        ),
        reviewDate: reviewedTitle.reviewDate,
        reviewed: reviewedTitle.grade !== "Abandoned",
        reviewSequence: reviewedTitle.reviewSequence,
        reviewYear: reviewedTitle.reviewDate.getFullYear().toString(),
        slug: reviewedTitle.id,
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
    initialSort: "title-asc",
    values,
  };
}
