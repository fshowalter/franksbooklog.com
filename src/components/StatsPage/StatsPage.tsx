import { Box } from "../Box";
import { Layout } from "../Layout";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";
import { DistributionTable, IDistribution } from "./DistributionTable";
import { MostReadAuthors } from "./MostReadAuthors";
import { StatsCallouts } from "./StatsCallouts";
import { StatsNavigation } from "./StatsNavigation";

export function StatsPage({
  title,
  tagline,
  readingCount,
  reviewCount,
  bookCount,
  fromShelfCount,
  mostReadAuthors,
  gradeDistributions,
  kindDistributions,
  editionDistributions,
  decadeDistributions,
  allYears,
}: {
  readingCount: number;
  reviewCount: number;
  bookCount: number;
  fromShelfCount: number;
  mostReadAuthors: readonly Queries.MostReadAuthorFragment[];
  gradeDistributions?: readonly IDistribution[];
  kindDistributions: readonly IDistribution[];
  editionDistributions: readonly IDistribution[];
  decadeDistributions: readonly IDistribution[];
  allYears: readonly string[];
  title: string;
  tagline: string;
}): JSX.Element {
  return (
    <Layout>
      <Box as="main">
        <Box
          as="header"
          display="flex"
          flexDirection={{ default: "column", desktop: "row" }}
          justifyContent="space-between"
          flexWrap="wrap"
          paddingX="pageMargin"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems={{ default: "center", desktop: "flex-start" }}
          >
            <PageTitle paddingTop={{ default: 24, desktop: 32 }}>
              {title}
            </PageTitle>
            <Box as="p" color="subtle">
              {tagline}
            </Box>
            <Spacer axis="vertical" size={24} />
            <StatsNavigation years={allYears} />
          </Box>
          <Box>
            <Spacer axis="vertical" size={32} />
            <StatsCallouts
              readingCount={readingCount}
              reviewCount={reviewCount}
              bookCount={bookCount}
              fromShelfCount={fromShelfCount}
            />
          </Box>
        </Box>
        <Box paddingX={{ default: 0, tablet: "gutter", desktop: "pageMargin" }}>
          <Spacer axis="vertical" size={32} />
          <MostReadAuthors authors={mostReadAuthors} />
          {gradeDistributions && (
            <>
              <Spacer axis="vertical" size={32} />
              <DistributionTable
                distributions={gradeDistributions}
                title="Grade Distribution"
                nameColumnLabel="Grade"
                countColumnLabel="Reviews"
              />
            </>
          )}
          <Spacer axis="vertical" size={32} />
          <DistributionTable
            distributions={decadeDistributions}
            title="By Year Published"
            nameColumnLabel="Decade"
            countColumnLabel="Titles"
          />
          <Spacer axis="vertical" size={32} />
          <DistributionTable
            distributions={kindDistributions}
            title="By Kind"
            nameColumnLabel="Kind"
            countColumnLabel="Titles"
          />
          <Spacer axis="vertical" size={32} />
          <DistributionTable
            distributions={editionDistributions}
            title="By Edition"
            nameColumnLabel="Edition"
            countColumnLabel="Titles"
          />
          <Spacer axis="vertical" size={64} />
        </Box>
      </Box>
    </Layout>
  );
}
