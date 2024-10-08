import { allAuthors } from "src/api/authors";
import { getAvatarImageProps } from "src/api/avatars";
import { ListItemAvatarImageConfig } from "src/components/ListItemAvatar";

import type { ListItemValue, Props } from "./Authors";

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

  return {
    values,
    initialSort: "name-asc",
    deck: '"There is nothing to writing. All you do is sit down at a typewriter and bleed."',
  };
}
