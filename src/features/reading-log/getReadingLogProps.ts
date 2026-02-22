import type { ReadingEntryData } from "~/content.config";

import { getFluidCoverImageProps } from "~/api/covers";
import { allReadingEntries } from "~/api/readings";

import type { ReadingLogValue } from "./ReadingLog";
import type { ReadingLogProps } from "./ReadingLog";

import { ReadingLogImageConfig } from "./ReadingLog";

export async function getReadingLogProps(
  entries: ReadingEntryData[],
): Promise<ReadingLogProps> {
  const {
    distinctEditions,
    distinctKinds,
    distinctReadingYears,
    distinctWorkYears,
    readingEntries,
  } = allReadingEntries(entries);

  // Don't pre-sort here - let the component handle sorting
  // timelineEntries.sort((a, b) => b.timelineSequence - a.timelineSequence);

  const values = await Promise.all(
    readingEntries.map(async (entry) => {
      const value: ReadingLogValue = {
        authors: entry.authors.map((author) => {
          const authorValue: ReadingLogValue["authors"][0] = {
            name: author.name,
          };

          return authorValue;
        }),
        coverImageProps: await getFluidCoverImageProps(
          entry,
          ReadingLogImageConfig,
        ),
        edition: entry.edition,
        entrySequence: entry.readingEntrySequence,
        kind: entry.kind,
        progress: entry.progress,
        readingDate: entry.readingEntryDate, // Keep original date string for calendar
        readingYear: entry.readingEntryDate.slice(0, 4),
        reviewed: entry.reviewed,
        slug: entry.slug,
        title: entry.title,
        workYear: entry.workYear,
      };

      return value;
    }),
  );

  return {
    distinctEditions,
    distinctKinds,
    distinctReadingYears,
    distinctWorkYears,
    initialSort: "reading-date-desc",
    values,
  };
}
