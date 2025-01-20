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
        reviewedWorkCount: author.reviewedWorkCount,
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
    deck: `"I had killed a man, for money and a woman. I didn't have the money and I didn't have the woman."`,
    initialSort: "name-asc",
    values,
  };
}
