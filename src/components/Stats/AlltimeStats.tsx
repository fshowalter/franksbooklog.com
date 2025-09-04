import type { BackdropImageProps } from "~/api/backdrops";
import type { AlltimeStats } from "~/api/stats";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { Layout } from "~/components/Layout/Layout";

import { Callouts } from "./Callouts";
import { DecadeDistribution } from "./DecadeDistribution";
import { EditionDistribution } from "./EditionDistribution";
import { GradeDistribution } from "./GradeDistribution";
import { KindDistribution } from "./KindDistribution";
import { MostReadAuthors } from "./MostReadAuthors";
import { StatsNavigation } from "./StatsNavigation";

export type AlltimeStatsProps = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctStatYears: string[];
  mostReadAuthors: React.ComponentProps<typeof MostReadAuthors>["values"];
  stats: AlltimeStats;
};

export function AlltimeStats({
  backdropImageProps,
  deck,
  distinctStatYears,
  mostReadAuthors,
  stats,
}: AlltimeStatsProps): React.JSX.Element {
  return (
    <Layout className="flex flex-col items-center bg-subtle" hasBackdrop={true}>
      <Backdrop
        breadcrumb={
          <BreadcrumbLink href="/readings/">Reading Log</BreadcrumbLink>
        }
        centerText={true}
        deck={deck}
        imageProps={backdropImageProps}
        title="All-Time Stats"
      />
      <StatsNavigation
        className="z-10 mb-12 w-full"
        currentYear={"all"}
        linkFunc={(year: string) => {
          return `/readings/stats/${year}/`;
        }}
        years={distinctStatYears}
      />
      <Callouts
        stats={[
          { label: "Titles", value: stats.workCount },
          { label: "Books", value: stats.bookCount },
          { label: "Reviews", value: stats.reviewCount },
        ]}
      />
      <div
        className={`
          mx-auto flex w-full max-w-(--breakpoint-desktop) flex-col
          items-stretch gap-y-8 py-10
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
        <div className="mx-auto w-full max-w-popout">
          <GradeDistribution values={stats.gradeDistribution} />
        </div>
      </div>
    </Layout>
  );
}
