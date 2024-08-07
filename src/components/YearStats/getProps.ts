import { getFixedCoverImageProps } from "src/api/covers";
import { allStatYears, statsForYear } from "src/api/yearStats";
import { ListItemCoverImageConfig } from "src/components/ListItemCover";

import type { Props } from "./YearStats";

export async function getProps(year: string): Promise<Props> {
  const distinctStatYears = await allStatYears();

  const stats = await statsForYear(year);

  return {
    year,
    stats,
    mostReadAuthors: await Promise.all(
      stats.mostReadAuthors.map(async (author) => {
        return {
          ...author,
          readings: await Promise.all(
            author.readings.map(async (reading) => {
              return {
                ...reading,
                coverImageProps: await getFixedCoverImageProps(
                  reading,
                  ListItemCoverImageConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    distinctStatYears,
  };
}
