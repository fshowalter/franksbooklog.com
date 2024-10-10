import type { UnreviewedWorkJson } from "./data/unreviewedWorksJson";

import { allUnreviewedWorksJson } from "./data/unreviewedWorksJson";

export type ShelfWork = {} & UnreviewedWorkJson;

type Shelf = {
  distinctAuthors: string[];
  distinctKinds: string[];
  distinctPublishedYears: string[];
  works: ShelfWork[];
};

function parseUnreviewedWorksJson(
  unreviewedWorksJson: UnreviewedWorkJson[],
): Shelf {
  const distinctAuthors = new Set<string>();
  const distinctPublishedYears = new Set<string>();
  const distinctKinds = new Set<string>();

  const works = unreviewedWorksJson.map((work) => {
    distinctKinds.add(work.kind);
    distinctPublishedYears.add(work.yearPublished);
    work.authors.forEach((author) => {
      distinctAuthors.add(author.name);
    });

    return {
      ...work,
    };
  });

  return {
    distinctAuthors: Array.from(distinctAuthors).toSorted(),
    distinctKinds: Array.from(distinctKinds).toSorted(),
    distinctPublishedYears: Array.from(distinctPublishedYears).toSorted(),
    works,
  };
}

export async function allShelfWorks(): Promise<Shelf> {
  const unreviewedWorksJson = await allUnreviewedWorksJson();
  const shelfWorks = parseUnreviewedWorksJson(unreviewedWorksJson);

  return shelfWorks;
}
