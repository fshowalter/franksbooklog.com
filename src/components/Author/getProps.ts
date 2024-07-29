import { type Author, getAuthorDetails } from "src/api/authors";
import { getAvatarImageProps } from "src/api/avatars";
import { getFixedCoverImageProps } from "src/api/covers";

import { ListItemCoverImageConfig } from "../ListItemCover";
import type { Props } from "./Author";
import { AvatarImageConfig } from "./Header";
import { type ListItemValue } from "./List";

function filterOtherAuthors(author: Author, work: Author["works"][number]) {
  return work.authors
    .filter((workAuthor) => {
      return author.name !== workAuthor.name;
    })
    .map((otherAuthor) => {
      return { name: otherAuthor.name };
    });
}

export async function getProps(slug: string): Promise<Props> {
  const { author, distinctKinds, distinctPublishedYears } =
    await getAuthorDetails(slug);

  author.works.sort((a, b) => a.yearPublished.localeCompare(b.yearPublished));

  const works = await Promise.all(
    author.works.map(async (work) => {
      const value: ListItemValue = {
        title: work.title,
        yearPublished: work.yearPublished,
        slug: work.slug,
        kind: work.kind,
        grade: work.grade,
        sortTitle: work.sortTitle,
        gradeValue: work.gradeValue,
        reviewed: work.reviewed,
        coverImageProps: await getFixedCoverImageProps(
          work,
          ListItemCoverImageConfig,
        ),
        otherAuthors: filterOtherAuthors(author, work),
      };

      return value;
    }),
  );

  return {
    works,
    name: author.name,
    shelfWorkCount: author.shelfWorkCount,
    reviewedWorkCount: author.reviewedWorkCount,
    distinctKinds,
    distinctPublishedYears,
    initialSort: "year-published-asc",
    avatarImageProps: await getAvatarImageProps(author.slug, AvatarImageConfig),
  };
}
