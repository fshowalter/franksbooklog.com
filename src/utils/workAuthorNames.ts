import { getEntry } from "astro:content";

import type { WorkAuthor } from "~/content.config";

export async function workAuthorNames(workAuthors: WorkAuthor[]) {
  return await Promise.all(
    workAuthors.map(async (workAuthor) => {
      const author = await getEntry(workAuthor.author);
      const notes = workAuthor.notes ? ` (${workAuthor.notes})` : "";

      return `${author.data.name}${notes}`;
    }),
  );
}
