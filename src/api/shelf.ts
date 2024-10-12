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
    for (const author of work.authors) {
      distinctAuthors.add(author.name);
    }

    return {
      ...work,
    };
  });

  return {
    distinctAuthors: [...distinctAuthors].toSorted(),
    distinctKinds: [...distinctKinds].toSorted(),
    distinctPublishedYears: [...distinctPublishedYears].toSorted(),
    works,
  };
}

export async function allShelfWorks(): Promise<Shelf> {
  const unreviewedWorksJson = await allUnreviewedWorksJson();
  const shelfWorks = parseUnreviewedWorksJson(unreviewedWorksJson);

  return shelfWorks;
}
