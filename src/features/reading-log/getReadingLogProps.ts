import type { CollectionEntry } from "astro:content";

import { getFluidCoverImageProps } from "~/api/covers";

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogProps } from "./ReadingLog";

import { ReadingLogImageConfig } from "./ReadingLog";

export async function getReadingLogProps(
  readingLogEntrys: CollectionEntry<"readingLog">["data"][],
): Promise<ReadingLogProps> {
  const distinctEditions = new Set<string>();
  const distinctKinds = new Set<string>();
  const distinctReadingYears = new Set<string>();
  const distinctWorkYears = new Set<string>();

  readingLogEntrys.sort((a, b) => a.sequence.localeCompare(b.sequence));

  const values = await Promise.all(
    readingLogEntrys.map(async (entry, index) => {
      distinctEditions.add(entry.edition);
      distinctKinds.add(entry.kind);
      distinctReadingYears.add(entry.date.toISOString().slice(0, 4));
      distinctWorkYears.add(entry.workYear);

      const value: ReadingLogValue = {
        abandoned: entry.progress === "Abandoned",
        authors: entry.authors,
        coverImageProps: await getFluidCoverImageProps(
          { slug: entry.reviewSlug || "default" },
          ReadingLogImageConfig,
        ),
        edition: entry.edition,
        kind: entry.kind,
        progress: entry.progress,
        readingDate: entry.date.toISOString(), // Keep original date string for calendar
        readingYear: entry.date.toISOString().slice(0, 4),
        reviewed: Boolean(entry.reviewSlug),
        sequence: index,
        slug: entry.reviewSlug,
        title: entry.title,
        workYear: entry.workYear,
      };

      return value;
    }),
  );

  return {
    distinctEditions: [...distinctEditions].toSorted(),
    distinctKinds: [...distinctKinds].toSorted(),
    distinctReadingYears: [...distinctReadingYears].toSorted(),
    distinctWorkYears: [...distinctWorkYears].toSorted(),
    initialSort: "reading-date-desc",
    values,
  };
}
