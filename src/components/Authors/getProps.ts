import { allAuthors } from "src/api/authors";
import { getAvatarImageProps } from "src/api/avatars";
import { ListItemAvatarImageConfig } from "src/components/ListItemAvatar";

import type { Props } from "./Authors";
import { type ListItemValue } from "./List";

export async function getProps(): Promise<Props> {
  const authors = await allAuthors();

  authors.sort((a, b) => a.sortName.localeCompare(b.sortName));

  const values = await Promise.all(
    authors.map(async (author) => {
      const value: ListItemValue = {
        name: author.name,
        slug: author.slug,
        sortName: author.sortName,
        reviewedWorkCount: author.reviewedWorkCount,
        workCount: author.workCount,
        avatarImageProps: await getAvatarImageProps(
          author.slug,
          ListItemAvatarImageConfig,
        ),
      };

      return value;
    }),
  );

  return { values, initialSort: "name-asc" };
}
