import { allAuthors } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import {
  type BackdropImageProps,
  getBackdropImageProps,
} from "~/api/backdrops";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarList";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";

import type { AuthorsProps, AuthorsValue } from "./Authors";

/**
 * Extended props type for Authors page including additional data for layout and display
 */
type Props = AuthorsProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
};

/**
 * Gets props for the Authors page component by fetching all author data and transforming it.
 * Loads all authors, their avatars, and prepares data needed for display, filtering, and sorting.
 * 
 * @returns Promise resolving to complete props object for Authors component
 */
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
