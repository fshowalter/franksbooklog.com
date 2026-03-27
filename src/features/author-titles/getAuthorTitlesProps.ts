import type { CollectionEntry } from "astro:content";

import { getEntry } from "astro:content";

import { getFluidCoverImageProps } from "~/assets/covers";

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
      const { data: review } = await getEntry(reviewedTitle.review);
      distinctKinds.add(reviewedTitle.kind);
      distinctReviewYears.add(
        reviewedTitle.reviewDate.getFullYear().toString(),
      );
      distinctTitleYears.add(reviewedTitle.titleYear);

      const value: AuthorTitlesValue = {
        abandoned: reviewedTitle.grade === "Abandoned",
        coverImageProps: await getFluidCoverImageProps(review.slug),
        excerptHtml: review.excerptHtml,
        grade: reviewedTitle.grade,
        gradeValue: reviewedTitle.gradeValue,
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
