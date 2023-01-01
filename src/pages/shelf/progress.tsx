import { graphql } from "gatsby";
import { BarGradient } from "../../components/BarGradient";
import { Box } from "../../components/Box";
import { HeadBuilder } from "../../components/HeadBuilder";
import { Layout } from "../../components/Layout";
import { Link } from "../../components/Link";
import { PageTitle } from "../../components/PageTitle";
import { ProgressRing } from "../../components/ProgressRing";
import { Spacer } from "../../components/Spacer";
import { StatHeading } from "../../components/StatHeading";
import {
  Table,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../../components/StatsTable";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="Watchlist Progress"
      description="My progress working through my movie review bucketlist."
      article={false}
      image={null}
    />
  );
}

function ProgressCallout({
  total,
  reviewed,
  label,
  subLabel,
}: {
  total: number | null;
  reviewed: number | null;
  label: string;
  subLabel?: string;
}): JSX.Element {
  return (
    <>
      <ProgressRing
        width={144}
        height={144}
        total={total ?? 0}
        complete={reviewed ?? 0}
        label={label}
        subLabel={subLabel}
      />
      <Spacer axis="vertical" size={8} />
      <Box color="subtle" textAlign="center">
        <Box>
          {reviewed?.toLocaleString()}/{total?.toLocaleString()}
        </Box>
        <Box fontSize="small" lineHeight={16}>
          Reviewed
        </Box>
      </Box>
    </>
  );
}

function EntityName({
  entity,
}: {
  entity: Queries.ShelfAuthorProgressFragment;
}) {
  if (entity.slug)
    return <Link to={`/shelf/authors/${entity.slug}/`}>{entity.name}</Link>;

  return (
    <Box as="span" color="subtle">
      {entity.name}
    </Box>
  );
}

function valueColor(reviewCount: number, totalCount: number) {
  if (reviewCount === 0) {
    return "subtle";
  }

  if (reviewCount === totalCount) {
    return "progress";
  }

  return undefined;
}

function AuthorProgressTable({
  label,
  entities,
}: {
  label: string;
  entities: readonly Queries.ShelfAuthorProgressFragment[];
}) {
  return (
    <section>
      <StatHeading>{label}</StatHeading>
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell align="left">Name</TableHeaderCell>
            <th>&nbsp;</th>
            <TableHeaderCell align="right">Progress</TableHeaderCell>
          </tr>
        </TableHead>
        <tbody>
          {entities.map((entity) => {
            return (
              <TableRow key={entity.name}>
                <TableDataCell align="left">
                  <EntityName entity={entity} />
                </TableDataCell>
                <TableDataCell hideOnSmallScreens align="fill">
                  <BarGradient
                    value={entity.reviewedShelfWorkCount}
                    maxValue={entity.shelfWorkCount}
                  />
                </TableDataCell>
                <TableDataCell
                  align="right"
                  color={valueColor(
                    entity.reviewedShelfWorkCount,
                    entity.shelfWorkCount
                  )}
                >
                  {entity.reviewedShelfWorkCount}/{entity.shelfWorkCount}
                </TableDataCell>
              </TableRow>
            );
          })}
        </tbody>
      </Table>
    </section>
  );
}

export default function WatchlistProgressPage({
  data,
}: {
  data: Queries.ShelfAuthorProgressPageQuery;
}): JSX.Element {
  return (
    <Layout>
      <Box as="main">
        <Box
          as="header"
          display="flex"
          flexDirection={{ default: "column", desktop: "row" }}
          flexWrap="wrap"
          paddingX="pageMargin"
          columnGap={32}
          justifyContent="space-between"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems={{ default: "center", desktop: "flex-start" }}
          >
            <PageTitle
              paddingTop={{ default: 24, desktop: 32 }}
              lineHeight={40}
            >
              Shelf Progress
            </PageTitle>
            <Box as="q" color="subtle">
              Read, read, read.
            </Box>
            <Spacer axis="vertical" size={16} />
            <Box color="subtle">
              <Spacer axis="vertical" size={16} />
              <p>
                My progress working through{" "}
                <Link to="/shelf/">my book-review bucketlist</Link>.
              </p>
            </Box>
          </Box>
          <Box
            display="flex"
            flexWrap="wrap"
            columnGap={32}
            justifyContent="center"
          >
            <Box
              minWidth={{ default: "full", tablet: 0 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Spacer axis="vertical" size={32} />
              <ProgressCallout
                total={data.shelfWorks.totalCount}
                reviewed={data.reviewedWorks.totalCount}
                label="Total Progress"
              />
            </Box>
            <Box>
              <Spacer axis="vertical" size={32} />
              <ProgressCallout
                total={data.authorTotal.sum}
                reviewed={data.authorReviewed.sum}
                label="Author"
                subLabel="Titles"
              />
            </Box>
          </Box>
        </Box>
        <Box paddingX={{ default: 0, tablet: "gutter", desktop: "pageMargin" }}>
          <Spacer axis="vertical" size={32} />
          <AuthorProgressTable
            label="Author Progress"
            entities={data.author.nodes}
          />
          <Spacer axis="vertical" size={64} />
        </Box>
      </Box>
    </Layout>
  );
}

export const pageQuery = graphql`
  fragment ShelfAuthorProgress on AuthorsJson {
    name
    reviewedShelfWorkCount
    shelfWorkCount
    slug
  }

  query ShelfAuthorProgressPage {
    reviewedWorks: allWorksJson(
      filter: { slug: { ne: null }, shelf: { eq: true } }
    ) {
      totalCount
    }
    shelfWorks: allWorksJson(filter: { shelf: { eq: true } }) {
      totalCount
    }
    author: allAuthorsJson(filter: { shelf: { eq: true } }) {
      nodes {
        ...ShelfAuthorProgress
      }
    }
    authorTotal: allAuthorsJson(filter: { shelf: { eq: true } }) {
      sum(field: { shelfWorkCount: SELECT })
    }
    authorReviewed: allAuthorsJson(filter: { shelf: { eq: true } }) {
      sum(field: { reviewedShelfWorkCount: SELECT })
    }
  }
`;
