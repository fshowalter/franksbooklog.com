import { getFluidCoverImageProps } from "src/api/covers";
import { allShelfWorks } from "src/api/shelf";
import { ListItemCoverImageConfig } from "src/components/ListItemCover";

import type { ListItemValue, Props } from "./Shelf";

export async function getProps(): Promise<Props> {
  const { works, distinctPublishedYears, distinctKinds, distinctAuthors } =
    await allShelfWorks();

  works.sort((a, b) =>
    a.authors[0].sortName.localeCompare(b.authors[0].sortName),
  );

  const values = await Promise.all(
    works.map(async (work) => {
      const value: ListItemValue = {
        title: work.title,
        slug: work.slug,
        sortTitle: work.sortTitle,
        coverImageProps: await getFluidCoverImageProps(
          work,
          ListItemCoverImageConfig,
        ),
        yearPublished: work.yearPublished,
        kind: work.kind,
        authors: work.authors.map((author) => {
          const authorValue: ListItemValue["authors"][number] = {
            name: author.name,
            sortName: author.sortName,
            notes: author.notes,
          };

          return authorValue;
        }),
      };

      return value;
    }),
  );

  return {
    values,
    distinctKinds,
    distinctPublishedYears,
    distinctAuthors,
    initialSort: "author-asc",
  };
}
