import type { BackdropImageProps } from "~/api/backdrops";
import type { YearStats } from "~/api/stats";

import { Backdrop, BreadcrumbLink } from "~/components/backdrop/Backdrop";
import { Layout } from "~/components/layout/Layout";

import { Callouts } from "./Callouts";
import { DecadeDistribution } from "./DecadeDistribution";
import { EditionDistribution } from "./EditionDistribution";
import { KindDistribution } from "./KindDistribution";
import { MostReadAuthors } from "./MostReadAuthors";
import { StatsNavigation } from "./StatsNavigation";

export type YearStatsProps = {
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
}: YearStatsProps): React.JSX.Element {
  return (
    <Layout className="flex flex-col items-center bg-subtle" hasBackdrop={true}>
      <Backdrop
        breadcrumb={
          <BreadcrumbLink href="/readings/">Reading Log</BreadcrumbLink>
        }
        centerText={true}
        deck={deck}
        imageProps={backdropImageProps}
        title={`${year} Stats`}
      />
      <StatsNavigation
        className="z-10 mb-12 w-full"
        currentYear={year}
        linkFunc={(year: string) => {
          if (year === "all") {
            return "/readings/stats/";
          }

          return `/readings/stats/${year}/`;
        }}
        years={distinctStatYears}
      />
      <Callouts
        stats={[
          { label: "Titles", value: stats.workCount },
          { label: "Books", value: stats.bookCount },
        ]}
      />
      <div
        className={`
          mx-auto flex w-full max-w-(--breakpoint-laptop) flex-col items-stretch
          gap-y-8 py-10
          tablet:px-container
        `}
      >
        <div className={`mx-auto flex w-full max-w-popout flex-col gap-y-8`}>
          <MostReadAuthors values={mostReadAuthors} />
        </div>
        <div
          className={`
            mx-auto flex w-full max-w-popout flex-col items-start gap-y-8
            laptop:max-w-unset laptop:flex-row laptop:gap-x-8
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
