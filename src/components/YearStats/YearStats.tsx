import type { YearStats } from "src/api/yearStats";
import { DecadeDistribution } from "src/components/DecadeDistribution";
import { EditionDistribution } from "src/components/EditionDistribution";
import { KindDistribution } from "src/components/KindDistribution";
import { MostReadAuthors } from "src/components/MostReadAuthors";
import { StatsNavigation } from "src/components/StatsNavigation";

import { StatsBackdrop } from "../Backdrop";
import { Layout } from "../Layout";
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
    <Layout className="flex flex-col items-center bg-subtle">
      <StatsBackdrop
        breadcrumb={
          <a
            className="decoration-2 underline-offset-8 hover:text-accent hover:underline"
            href="/readings/"
          >
            Reading Log
          </a>
        }
        title={`${year} Stats`}
        deck={
          [...distinctStatYears].reverse()[0] === year
            ? "A year in progress..."
            : "A Year in Review"
        }
      >
        <StatsNavigation
          currentYear={year}
          linkFunc={(year: string) => {
            if (year === "all") {
              return "/readings/stats/";
            }

            return `/readings/stats/${year}/`;
          }}
          years={distinctStatYears}
          className="mb-8"
        />
        <Callouts workCount={stats.workCount} bookCount={stats.bookCount} />
      </StatsBackdrop>
      <div className="mx-auto flex w-full max-w-screen-max flex-col items-stretch gap-y-8 py-10 tablet:px-container">
        <div className="mx-auto flex w-full flex-col gap-y-8 desktop:max-w-[calc(66%_+_24px)]">
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
