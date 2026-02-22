import type { Author } from "~/api/authors";
import type { AuthorData, ReviewedWorkData } from "~/content.config";

import { getAuthorDetails } from "~/api/authors";
import { getFluidCoverImageProps } from "~/api/covers";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { AuthorTitlesProps, AuthorTitlesValue } from "./AuthorTitles";

export async function getAuthorTitlesProps(
  slug: string,
  authors: AuthorData[],
  works: ReviewedWorkData[],
): Promise<AuthorTitlesProps> {
  const details = getAuthorDetails(slug, authors, works);
  if (!details) throw new Error(`Author not found: ${slug}`);

  const { author, distinctKinds, distinctReviewYears, distinctWorkYears } =
    details;

  // Resolve reviewedWorks references to full work data for cover images and metadata
  const authorWorks = author.reviewedWorks
    .map((ref) => works.find((w) => w.slug === ref.id))
    .filter((w): w is ReviewedWorkData => w !== undefined);

  const values = await Promise.all(
    authorWorks.map(async (work) => {
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
    values,
  };
}

function filterOtherAuthors(author: Author, work: ReviewedWorkData) {
  return work.authors
    .filter((workAuthor) => {
      return author.name !== workAuthor.name;
    })
    .map((otherAuthor) => {
      return { name: otherAuthor.name };
    });
}
