import type { CollectionEntry } from "astro:content";

import { getAvatarImageProps } from "~/assets/avatars";
import { AvatarListItemImageConfig } from "~/features/authors/GroupedAvatarList";

import type { AuthorsProps, AuthorsValue } from "./Authors";

export async function getAuthorsProps(
  authors: CollectionEntry<"reviewedAuthors">["data"][],
): Promise<AuthorsProps> {
  const sortedAuthors = authors.toSorted((a, b) =>
    a.sortName.localeCompare(b.sortName),
  );

  const values = await Promise.all(
    sortedAuthors.map(async (author) => {
      const reviewCount = author.reviewedTitles.length;

      const value: AuthorsValue = {
        avatarImageProps: await getAvatarImageProps(
          author.slug,
          AvatarListItemImageConfig,
        ),
        name: author.name,
        reviewCount: reviewCount,
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
