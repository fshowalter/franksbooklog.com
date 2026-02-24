import type {
  AuthorData,
  ReadingData,
  ReviewData,
  WorkData,
} from "~/content.config";

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

// AIDEV-NOTE: ReadingEntry is the flat, enriched shape produced from a single
// timeline entry on a ReadingData record. Defined at module level to avoid
// potential lint issues with inner type declarations.
// `slug` is the work slug (reading.workSlug) — used by getFluidCoverImageProps.
type ReadingEntry = {
  authors: { name: string; slug: string; sortName: string }[];
  edition: string;
  kind: WorkData["kind"];
  progress: string;
  readingEntryDate: string; // YYYY-MM-DD from timeline[i].date.toISOString().slice(0, 10)
  readingEntrySequence: number;
  reviewed: boolean;
  slug: string; // work slug (reading.workSlug)
  title: string;
  workYear: string;
};

/**
 * Expands all reading timelines into flat, enriched entries sorted ascending by date.
 * Builds lookup maps for O(1) access; expands each reading's timeline[] into flat
 * entries with a composite sort key; assigns 1-based readingEntrySequence after sort.
 *
 * @param readings - ReadingData array from the readings collection
 * @param works - WorkData array from the works collection
 * @param reviews - ReviewData array from the reviews collection
 * @param authors - AuthorData array from the authors collection
 * @returns Reading entries with metadata and counts
 */
export function allReadingEntries(
  readings: ReadingData[],
  works: WorkData[],
  reviews: ReviewData[],
  authors: AuthorData[],
): ReadingEntries {
  // Build lookup maps
  const authorsMap = new Map(authors.map((a) => [a.slug, a]));
  const worksMap = new Map(works.map((w) => [w.slug, w]));
  // ReviewData.slug is a { collection, id } reference — extract .id for the set
  const reviewedSlugs = new Set(reviews.map((r) => r.slug.id));

  // Expand all timeline entries with a composite sort key
  const rawEntries: { entry: ReadingEntry; sortKey: string }[] = [];
  for (const reading of readings) {
    const work = worksMap.get(reading.workSlug)!;
    const enrichedAuthors = work.authors.map((a) => ({
      name: authorsMap.get(a.slug)?.name ?? a.slug,
      slug: a.slug,
      sortName: authorsMap.get(a.slug)?.sortName ?? a.slug,
    }));
    for (const timelineEntry of reading.timeline) {
      const dateStr = timelineEntry.date.toISOString().slice(0, 10);
      rawEntries.push({
        entry: {
          authors: enrichedAuthors,
          edition: reading.edition,
          kind: work.kind,
          progress: timelineEntry.progress,
          readingEntryDate: dateStr,
          readingEntrySequence: 0, // assigned after sort
          reviewed: reviewedSlugs.has(reading.workSlug),
          slug: reading.workSlug,
          title: work.title,
          workYear: work.workYear,
        },
        sortKey: `${dateStr}-${String(reading.sequence).padStart(3, "0")}`,
      });
    }
  }

  // Sort ascending; assign 1-based sequence
  rawEntries.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  const expandedEntries = rawEntries.map((raw, i) => ({
    ...raw.entry,
    readingEntrySequence: i + 1,
  }));

  const distinctWorkYears = new Set<string>();
  const distinctReadingYears = new Set<string>();
  const distinctKinds = new Set<string>();
  const distinctEditions = new Set<string>();

  for (const entry of expandedEntries) {
    distinctEditions.add(entry.edition);
    distinctKinds.add(entry.kind);
    distinctReadingYears.add(entry.readingEntryDate.slice(0, 4));
    distinctWorkYears.add(entry.workYear);
  }

  const terminalEntries = expandedEntries.filter(
    (e) => e.progress === "Finished" || e.progress === "Abandoned",
  );

  return {
    abandonedCount: terminalEntries.filter((e) => e.progress === "Abandoned")
      .length,
    bookCount: terminalEntries.filter((e) => e.kind !== "Short Story").length,
    distinctEditions: [...distinctEditions].toSorted(),
    distinctKinds: [...distinctKinds].toSorted(),
    distinctReadingYears: [...distinctReadingYears].toSorted(),
    distinctWorkYears: [...distinctWorkYears].toSorted(),
    readingEntries: expandedEntries,
    shortStoryCount: terminalEntries.filter((e) => e.kind === "Short Story")
      .length,
    workCount: terminalEntries.length,
  };
}
