import { alltimeStats } from "~/api/alltimeStats";
import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { allStatYears } from "~/api/yearStats";
import { BackdropImageConfig } from "~/components/Backdrop";
import { CoverListItemImageConfig } from "~/components/CoverList";
import { displayDate } from "~/utils/displayDate";

import { type Props } from "./AlltimeStats";

export async function getProps(): Promise<Props> {
  const stats = await alltimeStats();
  const distinctStatYears = await allStatYears();

  return {
    backdropImageProps: await getBackdropImageProps(
      "stats",
      BackdropImageConfig,
    ),
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
                  CoverListItemImageConfig,
                ),
                displayDate: displayDate(reading.date),
              };
            }),
          ),
        };
      }),
    ),
    stats,
  };
}
