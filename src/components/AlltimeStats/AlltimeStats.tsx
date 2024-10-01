import type { AlltimeStats } from "src/api/alltimeStats";
import { DecadeDistribution } from "src/components/DecadeDistribution";
import { EditionDistribution } from "src/components/EditionDistribution";
import { KindDistribution } from "src/components/KindDistribution";
import { MostReadAuthors } from "src/components/MostReadAuthors";
import { PageTitle } from "src/components/PageTitle";
import { StatsNavigation } from "src/components/StatsNavigation";

import { StatsBackdrop } from "../Backdrop";
import { Layout } from "../Layout";
import { Callouts } from "./Callouts";
import { GradeDistribution } from "./GradeDistribution";

export interface Props {
  stats: AlltimeStats;
  mostReadAuthors: React.ComponentProps<typeof MostReadAuthors>["values"];
  distinctStatYears: string[];
}

export function AlltimeStats({
  stats,
  distinctStatYears,
  mostReadAuthors,
}: Props): JSX.Element {
  return (
    <Layout
      addGradient={false}
      className="flex flex-col items-center bg-subtle"
    >
      <StatsBackdrop
        breadcrumb={<a href="/readings/">Reading Log</a>}
        title="All-Time Stats"
        deck={`${(distinctStatYears.length - 1).toString()} Years in Review`}
      >
        <StatsNavigation
          currentYear={"all"}
          linkFunc={(year: string) => {
            return `/readings/stats/${year}/`;
          }}
          years={distinctStatYears}
        />
        <Callouts
          workCount={stats.workCount}
          bookCount={stats.bookCount}
          reviewCount={stats.reviewCount}
        />
      </StatsBackdrop>
      <div className="mx-auto flex w-full max-w-screen-max flex-col items-stretch gap-y-8 py-10 tablet:px-container">
        <MostReadAuthors values={mostReadAuthors} />
        <GradeDistribution values={stats.gradeDistribution} />
        <DecadeDistribution values={stats.decadeDistribution} />
        <KindDistribution values={stats.kindDistribution} />
        <EditionDistribution values={stats.editionDistribution} />
      </div>
    </Layout>
  );
}
