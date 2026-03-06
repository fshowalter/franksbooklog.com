import { getEntry } from "astro:content";

import type { WorkAuthor } from "~/content.config";

const longFormatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const shortFormatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const formatterMap: Record<string, Intl.ListFormat> = {
  long: longFormatter,
  sort: shortFormatter,
};

export async function formatWorkAuthors(
  workAuthors: WorkAuthor[],
  style: "long" | "short" = "long",
) {
  const formatter = formatterMap[style];

  return formatter.format(
    await Promise.all(
      workAuthors.map(async (workAuthor) => {
        const author = await getEntry(workAuthor.author);
        const notes = workAuthor.notes ? ` (${workAuthor.notes})` : "";

        return `${author.data.name}${notes}`;
      }),
    ),
  );
}
