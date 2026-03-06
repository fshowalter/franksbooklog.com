import type { CollectionEntry } from "astro:content";

import { getEntry } from "astro:content";

import { toSentenceArray } from "./toSentenceArray";

export async function reviewPageTitle(work: CollectionEntry<"works">) {
  const titleAuthorNames = await Promise.all(
    work.data.authors.map(async (workAuthor) => {
      const author = await getEntry(workAuthor.author);
      return author.data.name;
    }),
  );

  const title = `${work.data.title} by ${toSentenceArray(titleAuthorNames).join("")}`;

  const kind = work.data.kind == "Short Story" ? "story" : "book";

  return `${title} ${kind} review`;
}
