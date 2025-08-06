import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { allTimelineEntries } from "~/api/timelineEntries";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemCoverImageConfig } from "~/components/ListItemCover";

import type { ListItemValue } from "./Readings";
import type { Props } from "./Readings";

export async function getProps(): Promise<Props> {
  const {
    abandonedCount,
    bookCount,
    distinctEditions,
    distinctKinds,
    distinctReadingYears,
    distinctWorkYears,
    shortStoryCount,
    timelineEntries,
    workCount,
  } = await allTimelineEntries();

  timelineEntries.sort((a, b) => b.timelineSequence.localeCompare(a.timelineSequence));

  const values = await Promise.all(
    timelineEntries.map(async (entry) => {
      const readingDate = new Date(entry.timelineDate);
      const value: ListItemValue = {
        authors: entry.authors.map((author) => {
          const authorValue: ListItemValue["authors"][0] = {
            name: author.name,
          };

          return authorValue;
        }),
        coverImageProps: await getFluidCoverImageProps(
          entry,
          ListItemCoverImageConfig,
        ),
        edition: entry.edition,
        kind: entry.kind,
        progress: entry.progress,
        readingDate: readingDate.toLocaleString("en-US", {
          day: "numeric",
          timeZone: "UTC",
        }),
        readingDay: readingDate.toLocaleString("en-US", {
          timeZone: "UTC",
          weekday: "short",
        }),
        readingMonth: readingDate.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        }),
        readingYear: readingDate.toLocaleString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        }),
        reviewed: entry.reviewed,
        sequence: entry.timelineSequence,
        slug: entry.slug,
        title: entry.title,
        yearPublished: entry.yearPublished,
      };

      return value;
    }),
  );

  return {
    abandonedCount,
    backdropImageProps: await getBackdropImageProps(
      "readings",
      BackdropImageConfig,
    ),
    bookCount,
    deck: `"Would you have a Ben Hur 1860, Third Edition, the one with the duplicated line on page 116?"`,
    distinctEditions,
    distinctKinds,
    distinctReadingYears,
    distinctWorkYears,
    initialSort: "progress-date-desc",
    shortStoryCount,
    values,
    workCount,
  };
}
