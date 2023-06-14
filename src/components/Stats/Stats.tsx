import { sortString } from "../../utils";
import { Box } from "../Box";
import { Layout } from "../Layout";
import { PageTitle } from "../PageTitle";
import { Spacer } from "../Spacer";
import { Callouts } from "./Callouts";
import { DistributionTable, IDistribution } from "./DistributionTable";
import { MostReadAuthors } from "./MostReadAuthors";
import { Nav } from "./Nav";

function sortGradeDistributions(gradeDistributions: readonly IDistribution[]) {
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
  gradeDistributions: readonly IDistribution[];
  kindDistributions: readonly IDistribution[];
  editionDistributions: readonly IDistribution[];
  decadeDistributions: readonly IDistribution[];
  allYears: readonly string[];
  title: string;
  tagline: string;
}): JSX.Element {
  const sortedGradeDistributions = sortGradeDistributions(gradeDistributions);

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
              readingCount={readingCount}
              reviewCount={reviewCount}
              bookCount={bookCount}
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
          <MostReadAuthors authors={mostReadAuthors} />
          <DistributionTable
            distributions={sortedGradeDistributions}
            title="Grade Distribution"
            nameColumnLabel="Grade"
            countColumnLabel="Reviews"
          />
          <DistributionTable
            distributions={decadeDistributions}
            title="By Year Published"
            nameColumnLabel="Decade"
            countColumnLabel="Titles"
          />
          <DistributionTable
            distributions={kindDistributions}
            title="By Kind"
            nameColumnLabel="Kind"
            countColumnLabel="Titles"
          />
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
