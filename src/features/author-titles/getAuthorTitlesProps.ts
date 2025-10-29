import type { Author } from "~/api/authors";

import { getAuthorDetails } from "~/api/authors";
import { getFluidCoverImageProps } from "~/api/covers";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { AuthorTitlesProps, AuthorTitlesValue } from "./AuthorTitles";

/**
 * Gets props for the Author page component by fetching author details and transforming work data.
 * Loads author information, work covers, and prepares all data needed for display and filtering.
 *
 * @param slug - Author slug identifier for fetching data
 * @returns Promise resolving to complete props object for Author component
 */
export async function getAuthorTitlesProps(
  slug: string,
): Promise<AuthorTitlesProps> {
  const { author, distinctKinds, distinctReviewYears, distinctWorkYears } =
    await getAuthorDetails(slug);

  const works = await Promise.all(
    author.reviewedWorks.map(async (work) => {
      const value: AuthorTitlesValue = {
        coverImageProps: await getFluidCoverImageProps(
          work,
          CoverListItemImageConfig,
        ),
        displayDate: displayDate(work.reviewDate),
        grade: work.grade,
        gradeValue: work.gradeValue,
        kind: work.kind,
        otherAuthors: filterOtherAuthors(author, work),
        reviewDate: new Date(work.reviewDate),
        reviewSequence: work.reviewSequence,
        reviewYear: work.reviewYear,
        slug: work.slug,
        sortTitle: work.sortTitle,
        title: work.title,
        workYear: work.workYear,
      };

      return value;
    }),
  );

  return {
    distinctKinds,
    distinctReviewYears,
    distinctWorkYears,
    initialSort: "title-asc",
    values: works,
  };
}

/**
 * Filters out the current author from a work's author list to get co-authors.
 * Used to display "with [other authors]" text on work list items.
 *
 * @param author - The main author whose page this is
 * @param work - The work to get other authors for
 * @returns Array of other authors excluding the main author
 */
function filterOtherAuthors(
  author: Author,
  work: Author["reviewedWorks"][number],
) {
  return work.authors
    .filter((workAuthor) => {
      return author.name !== workAuthor.name;
    })
    .map((otherAuthor) => {
      return { name: otherAuthor.name };
    });
}
