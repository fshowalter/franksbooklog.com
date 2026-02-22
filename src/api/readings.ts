import type { ReadingEntryData } from "~/content.config";

/**
 * Type representing aggregated reading entries data with metadata and statistics.
 * Contains the full reading history plus derived counts and distinct values for filtering.
 */
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

/**
 * Type representing an individual reading entry.
 * Aliases ReadingEntryData from the content collections schema.
 */
type ReadingEntry = ReadingEntryData;

const yearFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
});

/**
 * Retrieves all reading entries with aggregated metadata and statistics.
 * Processes reading history to extract distinct values for filtering and provides
 * counts for different types of works (books, short stories, abandoned).
 *
 * @param entries - Pre-fetched ReadingEntryData array from the readingEntries collection
 * @returns Reading entries with metadata and counts
 */
export function allReadingEntries(entries: ReadingEntryData[]): ReadingEntries {
  const distinctWorkYears = new Set<string>();
  const distinctReadingYears = new Set<string>();
  const distinctKinds = new Set<string>();
  const distinctEditions = new Set<string>();
  const works = entries.filter((entry) => {
    return entry.progress === "Finished" || entry.progress === "Abandoned";
  });

  for (const entry of entries) {
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
    readingEntries: entries,
    shortStoryCount: works.filter((work) => work.kind === "Short Story")
      .length,
    workCount: works.length,
  };
}
