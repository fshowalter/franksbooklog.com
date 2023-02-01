import { sortStringAsc } from "../../utils";
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
  mostReadAuthors: readonly Queries.MostReadAuthorFragment[];
  gradeDistributions?: readonly IDistribution[];
  kindDistributions: readonly IDistribution[];
  editionDistributions: readonly IDistribution[];
  decadeDistributions: readonly IDistribution[];
  allYears: readonly string[];
  title: string;
  tagline: string;
}): JSX.Element {
  const sortedGradeDistributions = gradeDistributions
    ? [...gradeDistributions].sort((a, b) => {
        if (!a.name && !b.name) {
          return 0;
        }

        if (!a.name) {
          return -1;
        }

        if (!b.name) {
          return 1;
        }

        if (a.name.length === 1 && b.name.length === 1) {
          return sortStringAsc(a.name, b.name);
        }

        if (a.name.startsWith(b.name[0])) {
          const aModifier = a.name[a.name.length - 1];
          const bModifier = b.name[b.name.length - 1];

          if (aModifier === bModifier) {
            return 0;
          }

          if (aModifier === "+") {
            return -1;
          }

          if (bModifier === "+") {
            return 1;
          }

          if (aModifier === "-") {
            return 1;
          }

          if (bModifier === "-") {
            return -1;
          }
        }

        return sortStringAsc(a.name, b.name);
      })
    : null;

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
            />
          </Box>
        </Box>
        <Box paddingX={{ default: 0, tablet: "gutter", desktop: "pageMargin" }}>
          <Spacer axis="vertical" size={32} />
          <MostReadAuthors authors={mostReadAuthors} />
          {sortedGradeDistributions && (
            <>
              <Spacer axis="vertical" size={32} />
              <DistributionTable
                distributions={sortedGradeDistributions}
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
