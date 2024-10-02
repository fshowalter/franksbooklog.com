import { getFluidCoverImageProps } from "src/api/covers";
import { allTimelineEntries } from "src/api/timelineEntries";
import { ListItemCoverImageConfig } from "src/components/ListItemCover";

import type { ListItemValue } from "./Readings";
import type { Props } from "./Readings";

export async function getProps(): Promise<Props> {
  const {
    timelineEntries,
    distinctWorkYears,
    distinctKinds,
    distinctReadingYears,
    distinctEditions,
    bookCount,
    workCount,
    abandonedCount,
    shortStoryCount,
  } = await allTimelineEntries();

  timelineEntries.sort((a, b) => b.sequence.localeCompare(a.sequence));

  const values = await Promise.all(
    timelineEntries.map(async (entry) => {
      const readingDate = new Date(entry.date);
      const value: ListItemValue = {
        readingDate: readingDate.toLocaleString("en-US", {
          day: "numeric",
          timeZone: "UTC",
        }),
        readingMonth: readingDate.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        }),
        readingDay: readingDate.toLocaleString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        }),
        readingYear: readingDate.toLocaleString("en-US", {
          year: "numeric",
          timeZone: "UTC",
        }),
        title: entry.title,
        slug: entry.slug,
        coverImageProps: await getFluidCoverImageProps(
          entry,
          ListItemCoverImageConfig,
        ),
        yearPublished: entry.yearPublished,
        kind: entry.kind,
        sequence: entry.sequence,
        progress: entry.progress,
        reviewed: entry.reviewed,
        edition: entry.edition,
        authors: entry.authors.map((author) => {
          const authorValue: ListItemValue["authors"][0] = {
            name: author.name,
          };

          return authorValue;
        }),
      };

      return value;
    }),
  );

  return {
    values,
    distinctKinds,
    distinctReadingYears,
    distinctWorkYears,
    distinctEditions,
    initialSort: "progress-date-desc",
    workCount,
    bookCount,
    abandonedCount,
    shortStoryCount,
  };
}
