import { allAuthors } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import {
  type BackdropImageProps,
  getBackdropImageProps,
} from "~/api/backdrops";
import { AvatarListItemImageConfig } from "~/components/AvatarList";
import { BackdropImageConfig } from "~/components/Backdrop";

import type { AuthorsProps, AuthorsValue } from "./Authors";

type Props = AuthorsProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

export async function getProps(): Promise<Props> {
  const authors = await allAuthors();

  authors.sort((a, b) => a.sortName.localeCompare(b.sortName));

  const values = await Promise.all(
    authors.map(async (author) => {
      const value: AuthorsValue = {
        avatarImageProps: await getAvatarImageProps(
          author.slug,
          AvatarListItemImageConfig,
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
