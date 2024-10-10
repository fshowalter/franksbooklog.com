import { getFluidCoverImageProps } from "~/api/covers";
import { allShelfWorks } from "~/api/shelf";
import { ListItemCoverImageConfig } from "~/components/ListItemCover";

import type { ListItemValue, Props } from "./Shelf";

export async function getProps(): Promise<Props> {
  const { distinctAuthors, distinctKinds, distinctPublishedYears, works } =
    await allShelfWorks();

  works.sort((a, b) =>
    a.authors[0].sortName.localeCompare(b.authors[0].sortName),
  );

  const values = await Promise.all(
    works.map(async (work) => {
      const value: ListItemValue = {
        authors: work.authors.map((author) => {
          const authorValue: ListItemValue["authors"][number] = {
            name: author.name,
            notes: author.notes,
            sortName: author.sortName,
          };

          return authorValue;
        }),
        coverImageProps: await getFluidCoverImageProps(
          work,
          ListItemCoverImageConfig,
        ),
        kind: work.kind,
        slug: work.slug,
        sortTitle: work.sortTitle,
        title: work.title,
        yearPublished: work.yearPublished,
      };

      return value;
    }),
  );

  return {
    deck: `"Classic: A book which people praise and don’t read."`,
    distinctAuthors,
    distinctKinds,
    distinctPublishedYears,
    initialSort: "author-asc",
    values,
  };
}
