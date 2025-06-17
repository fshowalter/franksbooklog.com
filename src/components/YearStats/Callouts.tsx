import type { JSX } from "react";

import type { YearStats } from "~/api/yearStats";

import { StatsCallout } from "~/components/StatsCallout";

type Props = Pick<YearStats, "bookCount" | "workCount"> & {};

export function Callouts({ bookCount, workCount }: Props): JSX.Element {
  return (
    <div
      className={`
      flex flex-wrap justify-center gap-6
      desktop:flex-nowrap
    `}
    >
      <StatsCallout label="Titles" value={workCount} />
      <StatsCallout label="Books" value={bookCount} />
    </div>
  );
}
