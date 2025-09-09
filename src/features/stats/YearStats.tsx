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

/**
 * Props interface for the YearStats page component.
 * Contains all data needed to render yearly reading statistics.
 */
export type YearStatsProps = {
  /** Backdrop image properties */
  backdropImageProps: BackdropImageProps;
  /** Subtitle text for the page */
  deck: string;
  /** Available years for navigation */
  distinctStatYears: readonly string[];
  /** Most read authors data for the year */
  mostReadAuthors: React.ComponentProps<typeof MostReadAuthors>["values"];
  /** Complete statistics data for the year */
  stats: YearStats;
  /** The specific year being displayed */
  year: string;
};

/**
 * Year statistics page component displaying reading stats for a specific year.
 * Shows various distributions, callouts, and navigation between years.
 *
 * @param props - Component props
 * @param props.backdropImageProps - Backdrop image properties
 * @param props.deck - Subtitle text for the page
 * @param props.distinctStatYears - Available years for navigation
 * @param props.mostReadAuthors - Most read authors data for the year
 * @param props.stats - Complete statistics data for the year
 * @param props.year - The specific year being displayed
 * @returns Year statistics page component
 */
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
