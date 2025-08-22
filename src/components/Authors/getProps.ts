import { allAuthors } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import { getBackdropImageProps } from "~/api/backdrops";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemAvatarImageConfig } from "~/components/ListItemAvatar";

import type { ListItemValue, Props } from "./Authors";

export async function getProps(): Promise<Props> {
  const authors = await allAuthors();

  authors.sort((a, b) => a.sortName.localeCompare(b.sortName));

  const values = await Promise.all(
    authors.map(async (author) => {
      const value: ListItemValue = {
        avatarImageProps: await getAvatarImageProps(
          author.slug,
          ListItemAvatarImageConfig,
        ),
        name: author.name,
        reviewCount: author.reviewedWorks.length,
        slug: author.slug,
        sortName: author.sortName,
      };

      return value;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "authors",
      BackdropImageConfig,
    ),
    deck: '"Maybe I can glue it together. In the morning"',
    initialSort: "name-asc",
    values,
  };
}
