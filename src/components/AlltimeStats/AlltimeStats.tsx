import type { JSX } from "react";

import type { AlltimeStats } from "~/api/alltimeStats";

import { SolidBackdrop } from "~/components/Backdrop";
import { DecadeDistribution } from "~/components/DecadeDistribution";
import { EditionDistribution } from "~/components/EditionDistribution";
import { KindDistribution } from "~/components/KindDistribution";
import { Layout } from "~/components/Layout";
import { MostReadAuthors } from "~/components/MostReadAuthors";
import { StatsNavigation } from "~/components/StatsNavigation";

import { Callouts } from "./Callouts";
import { GradeDistribution } from "./GradeDistribution";

export type Props = {
  deck: string;
  distinctStatYears: string[];
  mostReadAuthors: React.ComponentProps<typeof MostReadAuthors>["values"];
  stats: AlltimeStats;
};

export function AlltimeStats({
  deck,
  distinctStatYears,
  mostReadAuthors,
  stats,
}: Props): JSX.Element {
  return (
    <Layout
      addGradient={false}
      className="flex flex-col items-center bg-subtle"
    >
      <SolidBackdrop
        breadcrumb={
          <a className="text-accent" href="/readings/">
            Reading Log
          </a>
        }
        deck={deck}
        title="All-Time Stats"
      />
      <StatsNavigation
        className="mb-12 w-full"
        currentYear={"all"}
        linkFunc={(year: string) => {
          return `/readings/stats/${year}/`;
        }}
        years={distinctStatYears}
      />
      <Callouts
        bookCount={stats.bookCount}
        reviewCount={stats.reviewCount}
        workCount={stats.workCount}
      />
      <div className="mx-auto flex w-full max-w-screen-max flex-col items-stretch gap-y-8 py-10 tablet:px-container">
        <div className="mx-auto flex w-full flex-col gap-y-8 desktop:max-w-[calc(66%_+_24px)]">
          <GradeDistribution values={stats.gradeDistribution} />
          <MostReadAuthors values={mostReadAuthors} />
        </div>
        <div className="flex flex-col items-start gap-y-8 desktop:flex-row desktop:gap-x-8">
          <DecadeDistribution values={stats.decadeDistribution} />
          <KindDistribution values={stats.kindDistribution} />
          <EditionDistribution values={stats.editionDistribution} />
        </div>
      </div>
    </Layout>
  );
}
