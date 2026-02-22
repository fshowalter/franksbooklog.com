import type { MostReadAuthor } from "~/api/data/MostReadAuthorSchema";
import type { AlltimeStatData, YearStatData } from "~/content.config";

import { getFluidCoverImageProps } from "~/api/covers";
import { allStatYears, alltimeStats, statsForYear } from "~/api/stats";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { AlltimeStatsProps } from "./AlltimeStats";
import type { MostReadAuthorsListItemValue } from "./MostReadAuthors";
import type { YearStatsProps } from "./YearStats";

export async function getAlltimeStatsProps(
  data: AlltimeStatData,
  yearStats: YearStatData[],
): Promise<AlltimeStatsProps> {
  const stats = alltimeStats(data);
  const distinctStatYears = allStatYears(yearStats);

  return {
    distinctStatYears,
    mostReadAuthors: await createMostReadAuthorsListItemValueProps(
      stats.mostReadAuthors,
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

  return {
    distinctStatYears,
    mostReadAuthors: await createMostReadAuthorsListItemValueProps(
      stats!.mostReadAuthors,
    ),
    stats: stats!,
    year,
  };
}

async function createMostReadAuthorsListItemValueProps(
  authors: MostReadAuthor[],
): Promise<MostReadAuthorsListItemValue[]> {
  return Promise.all(
    authors.map(async (author) => {
      return {
        ...author,
        readings: await Promise.all(
          author.readings.map(async (reading) => {
            return {
              ...reading,
              coverImageProps: await getFluidCoverImageProps(
                reading,
                CoverListItemImageConfig,
              ),
              displayDate: displayDate(reading.date),
            };
          }),
        ),
      };
    }),
  );
}
