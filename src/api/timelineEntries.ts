import type { TimelineEntryJson } from "./data/timelineEntriesJson";

import { allTimelineEntriesJson } from "./data/timelineEntriesJson";

export type TimelineEntry = {} & TimelineEntryJson;

type TimelineEntries = {
  abandonedCount: number;
  bookCount: number;
  distinctEditions: string[];
  distinctKinds: string[];
  distinctReadingYears: string[];
  distinctWorkYears: string[];
  shortStoryCount: number;
  timelineEntries: TimelineEntry[];
  workCount: number;
};

const yearFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
});

export async function allTimelineEntries(): Promise<TimelineEntries> {
  const timelineEntries = await allTimelineEntriesJson();
  const distinctWorkYears = new Set<string>();
  const distinctReadingYears = new Set<string>();
  const distinctKinds = new Set<string>();
  const distinctEditions = new Set<string>();
  const works = timelineEntries.filter((entry) => {
    return entry.progress === "Finished" || entry.progress === "Abandoned";
  });

  timelineEntries.forEach((entry) => {
    distinctEditions.add(entry.edition);
    distinctKinds.add(entry.kind);
    distinctReadingYears.add(yearFormatter.format(entry.date));
    distinctWorkYears.add(entry.yearPublished);
  });

  return {
    abandonedCount: works.filter((work) => work.progress === "Abandoned")
      .length,
    bookCount: works.filter((work) => work.kind !== "Short Story").length,
    distinctEditions: Array.from(distinctEditions).toSorted(),
    distinctKinds: Array.from(distinctKinds).toSorted(),
    distinctReadingYears: Array.from(distinctReadingYears).toSorted(),
    distinctWorkYears: Array.from(distinctWorkYears).toSorted(),
    shortStoryCount: works.filter((work) => work.kind === "Short Story").length,
    timelineEntries,
    workCount: works.length,
  };
}
