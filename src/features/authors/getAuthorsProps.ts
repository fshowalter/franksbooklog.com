import type { AuthorData } from "~/content.config";

import { allAuthors } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarList";

import type { AuthorsProps, AuthorsValue } from "./Authors";

export async function getAuthorsProps(
  authors: AuthorData[],
): Promise<AuthorsProps> {
  const sorted = allAuthors(authors).toSorted((a, b) =>
    a.sortName.localeCompare(b.sortName),
  );

  const values = await Promise.all(
    sorted.map(async (author) => {
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
