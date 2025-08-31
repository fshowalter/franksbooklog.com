import { type Author, getAuthorDetails } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { BackdropImageConfig } from "~/components/Backdrop";
import { CoverListItemImageConfig } from "~/components/CoverList";
import { displayDate } from "~/utils/displayDate";

import type { ListItemValue, Props } from "./Author";

import { AvatarImageConfig } from "./Author";

export async function getProps(slug: string): Promise<Props> {
  const { author, distinctKinds, distinctReviewYears, distinctWorkYears } =
    await getAuthorDetails(slug);

  author.reviewedWorks.sort((a, b) => a.workYearSequence - b.workYearSequence);

  const works = await Promise.all(
    author.reviewedWorks.map(async (work) => {
      const value: ListItemValue = {
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
