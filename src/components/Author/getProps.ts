import { type Author, getAuthorDetails } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import { getFluidCoverImageProps } from "~/api/covers";
import { ListItemCoverImageConfig } from "~/components/ListItemCover";

import type { ListItemValue, Props } from "./Author";

import { AvatarImageConfig } from "./Author";

function filterOtherAuthors(author: Author, work: Author["works"][number]) {
  return work.authors
    .filter((workAuthor) => {
      return author.name !== workAuthor.name;
    })
    .map((otherAuthor) => {
      return { name: otherAuthor.name };
    });
}

function deck({
  reviewedWorkCount,
  shelfWorkCount,
}: {
  reviewedWorkCount: Author["reviewedWorkCount"];
  shelfWorkCount: Author["shelfWorkCount"];
}): string {
  let shelfText = "";

  if (shelfWorkCount > 0) {
    shelfText = ` with ${shelfWorkCount} on the shelf`;
  }

  let works = "works";

  if (reviewedWorkCount === 1) {
    works = "work";
  }

  return `Author of ${reviewedWorkCount} reviewed ${works}${shelfText}.`;
}

export async function getProps(slug: string): Promise<Props> {
  const { author, distinctKinds, distinctPublishedYears } =
    await getAuthorDetails(slug);

  author.works.sort((a, b) => a.yearPublished.localeCompare(b.yearPublished));

  const works = await Promise.all(
    author.works.map(async (work) => {
      const value: ListItemValue = {
        coverImageProps: await getFluidCoverImageProps(
          work,
          ListItemCoverImageConfig,
        ),
        grade: work.grade,
        gradeValue: work.gradeValue,
        kind: work.kind,
        otherAuthors: filterOtherAuthors(author, work),
        reviewed: work.reviewed,
        slug: work.slug,
        sortTitle: work.sortTitle,
        title: work.title,
        yearPublished: work.yearPublished,
      };

      return value;
    }),
  );

  return {
    avatarImageProps: await getAvatarImageProps(author.slug, AvatarImageConfig),
    deck: deck(author),
    distinctKinds,
    distinctPublishedYears,
    initialSort: "year-published-asc",
    name: author.name,
    works,
  };
}
