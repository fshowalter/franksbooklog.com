import { perfLogger } from "~/utils/performanceLogger";

import type { ReadingEntryJson } from "./data/reading-entries-json";

import { allReadingEntriesJson } from "./data/reading-entries-json";

type ReadingEntries = {
  abandonedCount: number;
  bookCount: number;
  distinctEditions: string[];
  distinctKinds: string[];
  distinctReadingYears: string[];
  distinctWorkYears: string[];
  readingEntries: ReadingEntry[];
  shortStoryCount: number;
  workCount: number;
};

type ReadingEntry = ReadingEntryJson & {};

const yearFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
});

export async function allReadingEntries(): Promise<ReadingEntries> {
  return await perfLogger.measure("allTimelineEntries", async () => {
    const readingEntries = await allReadingEntriesJson();
    const distinctWorkYears = new Set<string>();
    const distinctReadingYears = new Set<string>();
    const distinctKinds = new Set<string>();
    const distinctEditions = new Set<string>();
    const works = readingEntries.filter((entry) => {
      return entry.progress === "Finished" || entry.progress === "Abandoned";
    });

    for (const entry of readingEntries) {
      distinctEditions.add(entry.edition);
      distinctKinds.add(entry.kind);
      distinctReadingYears.add(
        yearFormatter.format(new Date(entry.readingEntryDate)),
      );
      distinctWorkYears.add(entry.workYear);
    }

    return {
      abandonedCount: works.filter((work) => work.progress === "Abandoned")
        .length,
      bookCount: works.filter((work) => work.kind !== "Short Story").length,
      distinctEditions: [...distinctEditions].toSorted(),
      distinctKinds: [...distinctKinds].toSorted(),
      distinctReadingYears: [...distinctReadingYears].toSorted(),
      distinctWorkYears: [...distinctWorkYears].toSorted(),
      readingEntries,
      shortStoryCount: works.filter((work) => work.kind === "Short Story")
        .length,
      workCount: works.length,
    };
  });
}
