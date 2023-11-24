import { graphql } from "gatsby";
import { sortString } from "../../utils";
import { Box } from "../Box";
import { Layout } from "../Layout";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";
import { Callouts } from "./Callouts";
import { DistributionTable } from "./DistributionTable";
import { MostReadAuthors } from "./MostReadAuthors";
import { Nav } from "./Nav";

function sortGradeDistributions(
  gradeDistributions: readonly Queries.ReadingStatsJsonDistribution[],
) {
  return [...gradeDistributions].sort((a, b) => {
    if (!a.name && !b.name) {
      return 0;
    }

    if (!a.name || b.name === "Abandoned") {
      return -1;
    }

    if (!b.name || a.name === "Abandoned") {
      return 1;
    }

    if (a.name.length === 1 && b.name.length === 1) {
      return sortString(a.name, b.name);
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

    return sortString(a.name, b.name);
  });
}

export function Stats({
  data,
  title,
  tagline,
  allYears,
}: {
  data: Queries.StatsDataFragment;
  allYears: readonly string[];
  title: string;
  tagline: string;
}): JSX.Element {
  const sortedGradeDistributions = sortGradeDistributions(
    data.gradeDistribution,
  );

  return (
    <Layout>
      <Box as="main" display="flex" alignItems="center" flexDirection="column">
        <Box
          as="header"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          flexWrap="wrap"
          paddingX="pageMargin"
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <PageTitle paddingTop={{ default: 24, desktop: 32 }}>
              {title}
            </PageTitle>
            <Box as="p" color="subtle">
              {tagline}
            </Box>
            <Spacer axis="vertical" size={24} />
            <Nav years={allYears} />
          </Box>
          <Box>
            <Spacer axis="vertical" size={32} />
            <Callouts
              readingCount={data.readWorks}
              reviewCount={data.reviews}
              bookCount={data.books}
            />
          </Box>
        </Box>
        <Spacer axis="vertical" size={32} />
        <Box
          paddingX={{ default: 0, tablet: "gutter", desktop: "pageMargin" }}
          paddingY={32}
          display="flex"
          flexDirection="column"
          rowGap={32}
          alignItems="stretch"
          maxWidth={960}
          width="full"
        >
          <MostReadAuthors authors={data.mostReadAuthors} />
          <DistributionTable
            distributions={sortedGradeDistributions}
            title="Grade Distribution"
            nameColumnLabel="Grade"
            countColumnLabel="Reviews"
          />
          <DistributionTable
            distributions={data.decadeDistribution}
            title="By Year Published"
            nameColumnLabel="Decade"
            countColumnLabel="Titles"
          />
          <DistributionTable
            distributions={data.kindDistribution}
            title="By Kind"
            nameColumnLabel="Kind"
            countColumnLabel="Titles"
          />
          <DistributionTable
            distributions={data.editionDistribution}
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

export const pageQuery = graphql`
  fragment StatsData on ReadingStatsJson {
    decadeDistribution {
      count
      name
    }
    editionDistribution {
      count
      name
    }
    gradeDistribution {
      count
      name
    }
    kindDistribution {
      count
      name
    }
    mostReadAuthors {
      ...MostReadAuthor
    }
    readWorks
    reviews
    span
    books
  }
`;
