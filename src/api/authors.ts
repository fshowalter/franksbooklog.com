import { allAuthorsJson, type AuthorJson } from "./data/authorsJson";

export type Author = AuthorJson & {};

type AuthorDetails = {
  author: Author;
  distinctKinds: string[];
  distinctPublishedYears: string[];
};

export async function allAuthors(): Promise<Author[]> {
  return await allAuthorsJson();
}

export async function getAuthorDetails(slug: string): Promise<AuthorDetails> {
  const authors = await allAuthorsJson();
  const distinctKinds = new Set<string>();
  const distinctPublishedYears = new Set<string>();

  const author = authors.find((value) => value.slug === slug)!;

  for (const work of author.works) {
    distinctKinds.add(work.kind);
    distinctPublishedYears.add(work.yearPublished);
  }

  return {
    author,
    distinctKinds: [...distinctKinds].toSorted(),
    distinctPublishedYears: [...distinctPublishedYears].toSorted(),
  };
}
