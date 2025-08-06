import type { TimelineEntryJson } from "./data/timelineEntriesJson";

import { allTimelineEntriesJson } from "./data/timelineEntriesJson";

export type TimelineEntry = TimelineEntryJson & {};

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

  for (const entry of timelineEntries) {
    distinctEditions.add(entry.edition);
    distinctKinds.add(entry.kind);
    distinctReadingYears.add(
      yearFormatter.format(new Date(entry.timelineDate)),
    );
    distinctWorkYears.add(entry.yearPublished);
  }

  return {
    abandonedCount: works.filter((work) => work.progress === "Abandoned")
      .length,
    bookCount: works.filter((work) => work.kind !== "Short Story").length,
    distinctEditions: [...distinctEditions].toSorted(),
    distinctKinds: [...distinctKinds].toSorted(),
    distinctReadingYears: [...distinctReadingYears].toSorted(),
    distinctWorkYears: [...distinctWorkYears].toSorted(),
    shortStoryCount: works.filter((work) => work.kind === "Short Story").length,
    timelineEntries,
    workCount: works.length,
  };
}
