import { alltimeStats } from "src/api/alltimeStats";
import { getFixedCoverImageProps } from "src/api/covers";
import { allStatYears } from "src/api/yearStats";
import { ListItemCoverImageConfig } from "src/components/ListItemCover";

import { type Props } from "./AlltimeStats";

export async function getProps(): Promise<Props> {
  const stats = await alltimeStats();
  const distinctStatYears = await allStatYears();

  return {
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
