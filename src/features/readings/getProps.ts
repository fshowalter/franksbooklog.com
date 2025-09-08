import type { BackdropImageProps } from "~/api/backdrops";

import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { allReadingEntries } from "~/api/readings";
import { BackdropImageConfig } from "~/components/Backdrop";

import type { ReadingsValue } from "./Readings";
import type { ReadingsProps } from "./Readings";

import { ReadingsItemImageConfig } from "./Readings";

export async function getProps(): Promise<
  ReadingsProps & { backdropImageProps: BackdropImageProps; deck: string }
> {
  const {
    distinctEditions,
    distinctKinds,
    distinctReadingYears,
    distinctWorkYears,
    readingEntries,
  } = await allReadingEntries();

  // Don't pre-sort here - let the component handle sorting
  // timelineEntries.sort((a, b) => b.timelineSequence - a.timelineSequence);

  const values = await Promise.all(
    readingEntries.map(async (entry) => {
      const readingDate = new Date(entry.readingEntryDate);
      const value: ReadingsValue = {
        authors: entry.authors.map((author) => {
          const authorValue: ReadingsValue["authors"][0] = {
            name: author.name,
          };

          return authorValue;
        }),
        coverImageProps: await getFluidCoverImageProps(
          entry,
          ReadingsItemImageConfig,
        ),
        edition: entry.edition,
        entrySequence: entry.readingEntrySequence,
        kind: entry.kind,
        progress: entry.progress,
        readingDate: entry.readingEntryDate, // Keep original date string for calendar
        readingDay: readingDate.toLocaleString("en-US", {
          timeZone: "UTC",
          weekday: "short",
        }),
        readingMonth: readingDate.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        }),
        readingMonthShort: readingDate.toLocaleString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        readingYear: readingDate.toLocaleString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        }),
        reviewed: entry.reviewed,
        slug: entry.slug,
        title: entry.title,
        workYear: entry.workYear,
      };

      return value;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "readings",
      BackdropImageConfig,
    ),
    deck: `"You interest me. Rather vaguely."`,
    distinctEditions,
    distinctKinds,
    distinctReadingYears,
    distinctWorkYears,
    initialSort: "reading-date-desc",
    values,
  };
}
