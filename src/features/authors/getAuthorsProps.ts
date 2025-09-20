import { allAuthors } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarList";

import type { AuthorsProps, AuthorsValue } from "./Authors";

/**
 * Gets props for the Authors page component by fetching all author data and transforming it.
 * Loads all authors, their avatars, and prepares data needed for display, filtering, and sorting.
 *
 * @returns Promise resolving to complete props object for Authors component
 */
export async function getAuthorsProps(): Promise<AuthorsProps> {
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
    initialSort: "name-asc",
    values,
  };
}
