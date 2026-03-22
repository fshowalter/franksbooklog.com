import type { CollectionEntry } from "astro:content";

import { getFluidCoverImageProps } from "~/assets/covers";
import { toSortDate } from "~/utils/toSortDate";
import { toSortYear } from "~/utils/toSortYear";

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogProps } from "./ReadingLog";

import { ReadingLogImageConfig } from "./ReadingLog";

export async function getReadingLogProps(
  readingLogEntries: CollectionEntry<"readingLog">["data"][],
): Promise<ReadingLogProps> {
  const distinctEditions = new Set<string>();
  const distinctKinds = new Set<string>();
  const distinctReadingYears = new Set<string>();
  const distinctWorkYears = new Set<string>();

  readingLogEntries.sort((a, b) => a.sequence.localeCompare(b.sequence));

  const values = await Promise.all(
    readingLogEntries.map(async (entry, index) => {
      distinctEditions.add(entry.edition);
      distinctKinds.add(entry.kind);
      distinctReadingYears.add(toSortYear(entry.date));
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
        readingDate: toSortDate(entry.date), // Keep original date string for calendar
        readingYear: toSortYear(entry.date),
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
