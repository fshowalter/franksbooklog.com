import type {
  AlltimeStatData,
  ReadingData,
  ReviewedWorkData,
  YearStatData,
} from "~/content.config";

import { getCollection } from "astro:content";

import { getFluidCoverImageProps } from "~/api/covers";
import { allStatYears, alltimeStats, statsForYear } from "~/api/stats";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

type MostReadAuthor = AlltimeStatData["mostReadAuthors"][number];

import type { AlltimeStatsProps } from "./AlltimeStats";
import type { MostReadAuthorsListItemValue } from "./MostReadAuthors";
import type { YearStatsProps } from "./YearStats";

// AIDEV-NOTE: Both getStatsProps functions build readingsMap and worksMap once and
// pass them to createMostReadAuthorsListItemValueProps. Each reading ref is resolved
// to a ReadingData entry; the work slug looks up title and reviewed status from
// ReviewedWorkData (present in Stage 1 before reviewedWorks collection is removed).

async function buildStatsMaps() {
  const readingsEntries = await getCollection("readings");
  const readingsMap = new Map<string, ReadingData>(
    readingsEntries.map((e) => [e.id, e.data]),
  );
  const reviewedWorksEntries = await getCollection("reviewedWorks");
  const worksMap = new Map<string, ReviewedWorkData>(
    reviewedWorksEntries.map((e) => [e.id, e.data]),
  );
  return { readingsMap, worksMap };
}

export async function getAlltimeStatsProps(
  data: AlltimeStatData,
  yearStats: YearStatData[],
): Promise<AlltimeStatsProps> {
  const stats = alltimeStats(data);
  const distinctStatYears = allStatYears(yearStats);
  const { readingsMap, worksMap } = await buildStatsMaps();

  return {
    distinctStatYears,
    mostReadAuthors: await createMostReadAuthorsListItemValueProps(
      stats.mostReadAuthors,
      readingsMap,
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
  const { readingsMap, worksMap } = await buildStatsMaps();

  return {
    distinctStatYears,
    mostReadAuthors: await createMostReadAuthorsListItemValueProps(
      stats!.mostReadAuthors,
      readingsMap,
      worksMap,
    ),
    stats: stats!,
    year,
  };
}

async function createMostReadAuthorsListItemValueProps(
  authors: MostReadAuthor[],
  readingsMap: Map<string, ReadingData>,
  worksMap: Map<string, ReviewedWorkData>,
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
              reviewed: work !== undefined,
              slug: reading.workSlug,
              title: work?.title ?? reading.workSlug,
            };
          }),
        ),
      };
    }),
  );
}
