import { allAuthorsWithReviews } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import { ListItemAvatarImageConfig } from "~/components/ListItemAvatar";

import type { ListItemValue, Props } from "./Authors";

export async function getProps(): Promise<Props> {
  const authors = await allAuthorsWithReviews();

  authors.sort((a, b) => a.sortName.localeCompare(b.sortName));

  const values = await Promise.all(
    authors.map(async (author) => {
      const value: ListItemValue = {
        avatarImageProps: await getAvatarImageProps(
          author.slug,
          ListItemAvatarImageConfig,
        ),
        name: author.name,
        reviewedWorkCount: author.reviewedWorkCount,
        slug: author.slug,
        sortName: author.sortName,
      };

      return value;
    }),
  );

  return {
    deck: '"There is nothing to writing. All you do is sit down at a typewriter and bleed."',
    initialSort: "name-asc",
    values,
  };
}
