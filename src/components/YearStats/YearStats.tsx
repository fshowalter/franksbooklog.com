import type { YearStats } from "src/api/yearStats";
import { DecadeDistribution } from "src/components/DecadeDistribution";
import { EditionDistribution } from "src/components/EditionDistribution";
import { KindDistribution } from "src/components/KindDistribution";
import { MostReadAuthors } from "src/components/MostReadAuthors";
import { PageTitle } from "src/components/PageTitle";
import { StatsNavigation } from "src/components/StatsNavigation";

import { Callouts } from "./Callouts";

export interface Props {
  year: string;
  stats: YearStats;
  mostReadAuthors: React.ComponentProps<typeof MostReadAuthors>["values"];
  distinctStatYears: readonly string[];
}

export function YearStats({
  year,
  stats,
  mostReadAuthors,
  distinctStatYears,
}: Props): JSX.Element {
  return (
    <main className="flex flex-col items-center">
      <header className="flex flex-col flex-wrap justify-between px-pageMargin">
        <div className="flex flex-col items-center">
          <PageTitle className="pt-6 desktop:pt-8">{`${year} Stats`}</PageTitle>
          <p className="text-subtle">
            {[...distinctStatYears].reverse()[0] === year
              ? "A year in progress..."
              : "A Year in Review"}
          </p>
          <div className="spacer-y-6" />
          <StatsNavigation
            currentYear={year}
            linkFunc={(year: string) => {
              if (year === "all") {
                return "/readings/stats/";
              }

              return `/readings/stats/${year}/`;
            }}
            years={distinctStatYears}
          />
        </div>
        <div>
          <div className="spacer-y-8" />
          <Callouts workCount={stats.workCount} bookCount={stats.bookCount} />
        </div>
      </header>
      <div className="flex w-full max-w-screen-desktop flex-col items-stretch gap-y-8 py-8 tablet:px-gutter desktop:px-pageMargin">
        <MostReadAuthors values={mostReadAuthors} />
        <DecadeDistribution values={stats.decadeDistribution} />
        <KindDistribution values={stats.kindDistribution} />
        <EditionDistribution values={stats.editionDistribution} />
      </div>
    </main>
  );
}
