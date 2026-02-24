import { getCollection } from "astro:content";

import type {
  AlltimeStatData,
  ReadingData,
  WorkData,
  YearStatData,
} from "~/content.config";

import { getFluidCoverImageProps } from "~/api/covers";
import { allStatYears, alltimeStats, statsForYear } from "~/api/stats";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { AlltimeStatsProps } from "./AlltimeStats";
import type { MostReadAuthorsListItemValue } from "./MostReadAuthors";
import type { YearStatsProps } from "./YearStats";

type MostReadAuthor = AlltimeStatData["mostReadAuthors"][number];

// AIDEV-NOTE: Both getStatsProps functions build readingsMap, reviewedSlugs, and worksMap
// once and pass them to createMostReadAuthorsListItemValueProps. Each reading ref is resolved
// to a ReadingData entry; work slug looks up title from WorkData (works collection).
// reviewedSlugs derives "reviewed" status from the reviews collection (not reviewedWorks).

export async function getAlltimeStatsProps(
  data: AlltimeStatData,
  yearStats: YearStatData[],
): Promise<AlltimeStatsProps> {
  const stats = alltimeStats(data);
  const distinctStatYears = allStatYears(yearStats);
  const { readingsMap, reviewedSlugs, worksMap } = await buildStatsMaps();

  return {
    distinctStatYears,
    mostReadAuthors: await createMostReadAuthorsListItemValueProps(
      stats.mostReadAuthors,
      readingsMap,
      reviewedSlugs,
      worksMap,
    ),
    stats,
  };
}

export async function getYearStatsProps(
  year: string,
  yearStats: YearStatData[],
): Promise<YearStatsProps> {
  const distinctStatYears = allStatYears(yearStats);
  const stats = statsForYear(year, yearStats);
  const { readingsMap, reviewedSlugs, worksMap } = await buildStatsMaps();

  return {
    distinctStatYears,
    mostReadAuthors: await createMostReadAuthorsListItemValueProps(
      stats!.mostReadAuthors,
      readingsMap,
      reviewedSlugs,
      worksMap,
    ),
    stats: stats!,
    year,
  };
}

async function buildStatsMaps() {
  const readingsEntries = await getCollection("readings");
  const readingsMap = new Map<string, ReadingData>(
    readingsEntries.map((e) => [e.id, e.data]),
  );
  const reviewsEntries = await getCollection("reviews");
  const reviewedSlugs = new Set(reviewsEntries.map((e) => e.id));
  const worksEntries = await getCollection("works");
  const worksMap = new Map<string, WorkData>(
    worksEntries.map((e) => [e.id, e.data]),
  );
  return { readingsMap, reviewedSlugs, worksMap };
}

async function createMostReadAuthorsListItemValueProps(
  authors: MostReadAuthor[],
  readingsMap: Map<string, ReadingData>,
  reviewedSlugs: Set<string>,
  worksMap: Map<string, WorkData>,
): Promise<MostReadAuthorsListItemValue[]> {
  return Promise.all(
    authors.map(async (author) => {
      return {
        ...author,
        readings: await Promise.all(
          author.readings.map(async (ref) => {
            const reading = readingsMap.get(ref.id)!;
            const work = worksMap.get(reading.workSlug);
            return {
              coverImageProps: await getFluidCoverImageProps(
                { slug: reading.workSlug },
                CoverListItemImageConfig,
              ),
              displayDate: displayDate(reading.date),
              edition: reading.edition,
              reviewed: reviewedSlugs.has(reading.workSlug),
              slug: reading.workSlug,
              title: work?.title ?? reading.workSlug,
            };
          }),
        ),
      };
    }),
  );
}
