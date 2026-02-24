import { getCollection } from "astro:content";

import type { AuthorData } from "~/content.config";

import { allAuthors } from "~/api/authors";
import { getAvatarImageProps } from "~/api/avatars";
import { AvatarListItemImageConfig } from "~/components/avatar-list/AvatarList";

import type { AuthorsProps, AuthorsValue } from "./Authors";

export async function getAuthorsProps(
  authors: AuthorData[],
): Promise<AuthorsProps> {
  const [worksEntries, reviewsEntries] = await Promise.all([
    getCollection("works"),
    getCollection("reviews"),
  ]);

  // Set of work slugs that have a review entry (reviews entry ID = work slug)
  const reviewedSlugs = new Set(reviewsEntries.map((e) => e.id));

  const sorted = allAuthors(authors).toSorted((a, b) =>
    a.sortName.localeCompare(b.sortName),
  );

  const values = await Promise.all(
    sorted.map(async (author) => {
      const reviewCount = worksEntries.filter(
        (w) =>
          reviewedSlugs.has(w.id) &&
          w.data.authors.some((a) => a.slug === author.slug),
      ).length;

      const value: AuthorsValue = {
        avatarImageProps: await getAvatarImageProps(
          author.slug,
          AvatarListItemImageConfig,
        ),
        name: author.name,
        reviewCount,
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
