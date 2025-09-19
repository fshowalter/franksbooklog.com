import { type Author, getAuthorDetails } from "~/api/authors";
import { type AvatarImageProps, getAvatarImageProps } from "~/api/avatars";
import {
  type BackdropImageProps,
  getBackdropImageProps,
} from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { AuthorProps, AuthorValue } from "./AuthorWorks";

/**
 * Extended props type for Author page including additional data for layout and display
 */
type Props = AuthorProps & {
  avatarImageProps: AvatarImageProps | undefined;
  backdropImageProps: BackdropImageProps;
  deck: string;
};

import { AvatarImageConfig } from "./AuthorWorks";

/**
 * Gets props for the Author page component by fetching author details and transforming work data.
 * Loads author information, work covers, and prepares all data needed for display and filtering.
 *
 * @param slug - Author slug identifier for fetching data
 * @returns Promise resolving to complete props object for Author component
 */
export async function getProps(slug: string): Promise<Props> {
  const { author, distinctKinds, distinctReviewYears, distinctWorkYears } =
    await getAuthorDetails(slug);

  author.reviewedWorks.sort((a, b) => a.workYearSequence - b.workYearSequence);

  const works = await Promise.all(
    author.reviewedWorks.map(async (work) => {
      const value: AuthorValue = {
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
        workYearSequence: work.workYearSequence,
      };

      return value;
    }),
  );

  return {
    avatarImageProps: await getAvatarImageProps(author.slug, AvatarImageConfig),
    backdropImageProps: await getBackdropImageProps(
      "author",
      BackdropImageConfig,
    ),
    deck: deck(author),
    distinctKinds,
    distinctReviewYears,
    distinctWorkYears,
    initialSort: "title-asc",
    name: author.name,
    values: works,
  };
}

/**
 * Creates a descriptive deck text for the author based on their reviewed works count.
 * Handles singular/plural grammar for work count display.
 *
 * @param author - Author object containing reviewed works
 * @param author.reviewedWorks - Array of the author's reviewed works
 * @returns Formatted deck description string
 */
function deck({
  reviewedWorks,
}: {
  reviewedWorks: Author["reviewedWorks"];
}): string {
  const reviewedWorkCount = reviewedWorks.length;

  let works = "works";

  if (reviewedWorkCount === 1) {
    works = "work";
  }

  return `Author of ${reviewedWorkCount} reviewed ${works}.`;
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
