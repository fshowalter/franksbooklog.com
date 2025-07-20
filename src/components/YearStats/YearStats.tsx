import type { JSX } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { YearStats } from "~/api/yearStats";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { DecadeDistribution } from "~/components/DecadeDistribution";
import { EditionDistribution } from "~/components/EditionDistribution";
import { KindDistribution } from "~/components/KindDistribution";
import { Layout } from "~/components/Layout";
import { MostReadAuthors } from "~/components/MostReadAuthors";
import { StatsNavigation } from "~/components/StatsNavigation";

import { Callouts } from "./Callouts";

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctStatYears: readonly string[];
  mostReadAuthors: React.ComponentProps<typeof MostReadAuthors>["values"];
  stats: YearStats;
  year: string;
};

export function YearStats({
  backdropImageProps,
  deck,
  distinctStatYears,
  mostReadAuthors,
  stats,
  year,
}: Props): JSX.Element {
  return (
    <Layout className="flex flex-col items-center bg-subtle" hasBackdrop={true}>
      <Backdrop
        blur={true}
        breadcrumb={
          <BreadcrumbLink href="/readings/">Reading Log</BreadcrumbLink>
        }
        centerText={true}
        deck={deck}
        imageProps={backdropImageProps}
        size="small"
        title={`${year} Stats`}
      />
      <StatsNavigation
        className="mb-12 w-full"
        currentYear={year}
        linkFunc={(year: string) => {
          if (year === "all") {
            return "/readings/stats/";
          }

          return `/readings/stats/${year}/`;
        }}
        years={distinctStatYears}
      />
      <Callouts bookCount={stats.bookCount} workCount={stats.workCount} />
      <div
        className={`
          mx-auto flex w-full max-w-(--breakpoint-laptop) flex-col items-stretch
          gap-y-8 py-10
          tablet:px-container
        `}
      >
        <div
          className={`
            mx-auto flex w-full flex-col gap-y-8
            laptop:max-w-[calc(66%+24px)]
          `}
        >
          <MostReadAuthors values={mostReadAuthors} />
        </div>
        <div
          className={`
            flex flex-col items-start gap-y-8
            laptop:flex-row laptop:gap-x-8
          `}
        >
          <DecadeDistribution values={stats.decadeDistribution} />
          <KindDistribution values={stats.kindDistribution} />
          <EditionDistribution values={stats.editionDistribution} />
        </div>
      </div>
    </Layout>
  );
}
