import type { JSX } from "react";

import type { AlltimeStats } from "~/api/alltimeStats";

import { StatsCallout } from "~/components/StatsCallout";

type Props = Pick<AlltimeStats, "bookCount" | "reviewCount" | "workCount"> & {};

export function Callouts({
  bookCount,
  reviewCount,
  workCount,
}: Props): JSX.Element {
  return (
    <div
      className={`
      flex flex-wrap justify-center gap-6
      desktop:flex-nowrap
    `}
    >
      <StatsCallout label="Titles" value={workCount} />
      <StatsCallout label="Books" value={bookCount} />
      <StatsCallout label="Reviews" value={reviewCount} />
    </div>
  );
}
