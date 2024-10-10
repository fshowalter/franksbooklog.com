import { alltimeStats } from "~/api/alltimeStats";
import { getFluidCoverImageProps } from "~/api/covers";
import { allStatYears } from "~/api/yearStats";
import { ListItemCoverImageConfig } from "~/components/ListItemCover";

import { type Props } from "./AlltimeStats";

export async function getProps(): Promise<Props> {
  const stats = await alltimeStats();
  const distinctStatYears = await allStatYears();

  return {
    deck: `${(distinctStatYears.length - 1).toString()} Years in Review`,
    distinctStatYears,
    mostReadAuthors: await Promise.all(
      stats.mostReadAuthors.map(async (author) => {
        return {
          ...author,
          readings: await Promise.all(
            author.readings.map(async (reading) => {
              return {
                ...reading,
                coverImageProps: await getFluidCoverImageProps(
                  reading,
                  ListItemCoverImageConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    stats,
  };
}
