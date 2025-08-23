import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidCoverImageProps } from "~/api/covers";
import { allStatYears, statsForYear } from "~/api/yearStats";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemCoverImageConfig } from "~/components/ListItemCover";
import { displayDate } from "~/utils/displayDate";

import type { Props } from "./YearStats";

export async function getProps(year: string): Promise<Props> {
  const distinctStatYears = await allStatYears();

  const stats = await statsForYear(year);

  return {
    backdropImageProps: await getBackdropImageProps(
      "stats",
      BackdropImageConfig,
    ),
    deck:
      [...distinctStatYears].reverse()[0] === year
        ? "A year in progress..."
        : "A Year in Review",
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
                displayDate: displayDate(reading.date),
              };
            }),
          ),
        };
      }),
    ),
    stats,
    year,
  };
}
