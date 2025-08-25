import type { BackdropImageProps } from "~/api/backdrops";

import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { allTimelineEntries } from "~/api/timelineEntries";
import { BackdropImageConfig } from "~/components/Backdrop";

import type { ListItemValue } from "./Readings";
import type { Props } from "./Readings";

import { ReadingsItemImageConfig } from "./Readings";

export async function getProps(): Promise<
  Props & { backdropImageProps: BackdropImageProps; deck: string }
> {
  const {
    distinctEditions,
    distinctKinds,
    distinctReadingYears,
    distinctWorkYears,
    timelineEntries,
  } = await allTimelineEntries();

  // Don't pre-sort here - let the component handle sorting
  // timelineEntries.sort((a, b) => b.timelineSequence - a.timelineSequence);

  const values = await Promise.all(
    timelineEntries.map(async (entry) => {
      const readingDate = new Date(entry.timelineDate);
      const value: ListItemValue = {
        authors: entry.authors.map((author) => {
          const authorValue: ListItemValue["authors"][0] = {
            name: author.name,
            slug: author.slug,
            sortName: author.sortName,
          };

          return authorValue;
        }),
        coverImageProps: await getFluidCoverImageProps(
          entry,
          ReadingsItemImageConfig,
        ),
        edition: entry.edition,
        kind: entry.kind,
        progress: entry.progress,
        readingDate: entry.timelineDate, // Keep original date string for calendar
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
        timelineSequence: entry.timelineSequence,
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
