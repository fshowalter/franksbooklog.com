import type { JSX } from "react";

import type { YearStats } from "~/api/yearStats";

import { SolidBackdrop } from "~/components/Backdrop";
import { DecadeDistribution } from "~/components/DecadeDistribution";
import { EditionDistribution } from "~/components/EditionDistribution";
import { KindDistribution } from "~/components/KindDistribution";
import { Layout } from "~/components/Layout";
import { MostReadAuthors } from "~/components/MostReadAuthors";
import { StatsNavigation } from "~/components/StatsNavigation";

import { Callouts } from "./Callouts";

export type Props = {
  deck: string;
  distinctStatYears: readonly string[];
  mostReadAuthors: React.ComponentProps<typeof MostReadAuthors>["values"];
  stats: YearStats;
  year: string;
};

export function YearStats({
  deck,
  distinctStatYears,
  mostReadAuthors,
  stats,
  year,
}: Props): JSX.Element {
  return (
    <Layout className="flex flex-col items-center bg-subtle">
      <SolidBackdrop
        breadcrumb={
          <a className="text-accent" href="/readings/">
            Reading Log
          </a>
        }
        deck={deck}
        narrowTitle={true}
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
          mx-auto flex w-full max-w-(--breakpoint-max) flex-col items-stretch
          gap-y-8 py-10
          tablet:px-container
        `}
      >
        <div
          className={`
            mx-auto flex w-full flex-col gap-y-8
            desktop:max-w-[calc(66%+24px)]
          `}
        >
          <MostReadAuthors values={mostReadAuthors} />
        </div>
        <div
          className={`
            flex flex-col items-start gap-y-8
            desktop:flex-row desktop:gap-x-8
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
