import type { MostReadAuthor } from "~/api/data/MostReadAuthorSchema";

import { getFluidCoverImageProps } from "~/api/covers";
import { alltimeStats } from "~/api/stats";
import { allStatYears, statsForYear } from "~/api/stats";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { displayDate } from "~/utils/displayDate";

import type { AlltimeStatsProps } from "./AlltimeStats";
import type { MostReadAuthorsListItemValue } from "./MostReadAuthors";
import type { YearStatsProps } from "./YearStats";

export async function getAlltimeStatsProps(): Promise<AlltimeStatsProps> {
  const stats = await alltimeStats();
  const distinctStatYears = await allStatYears();

  return {
    distinctStatYears,
    mostReadAuthors: await createMostReadAuthorsListItemValueProps(
      stats.mostReadAuthors,
    ),
    stats,
  };
}

export async function getYearStatsProps(year: string): Promise<YearStatsProps> {
  const distinctStatYears = await allStatYears();
  const stats = await statsForYear(year);

  return {
    distinctStatYears,
    mostReadAuthors: await createMostReadAuthorsListItemValueProps(
      stats.mostReadAuthors,
    ),
    stats,
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
