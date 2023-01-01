import { graphql } from "gatsby";
import { Box } from "../components/Box";
import { CoverListWithFilters } from "../components/CoverListWithFilters";
import { HeadBuilder } from "../components/HeadBuilder";
import { Link } from "../components/Link";
import { PageTitle } from "../components/PageTitle";
import { Spacer } from "../components/Spacer";
import { foregroundColors } from "../styles/colors.css";

export function Head(): JSX.Element {
  return (
    <HeadBuilder
      pageTitle="The Shelf"
      description="My reading bucketlist."
      image={null}
      article={false}
    />
  );
}

/**
 * Renders the reviews page.
 */
export default function ShelfPage({
  data,
}: {
  data: Queries.ShelfPageQuery;
}): JSX.Element {
  return (
    <CoverListWithFilters
      items={data.work.nodes}
      distinctKinds={data.work.kinds}
      distinctPublishedYears={data.work.publishedYears}
      distinctAuthors={data.work.authors}
      initialSort="author-asc"
    >
      <PageTitle textAlign="center">The Shelf</PageTitle>
      <Box as="q" display="block" textAlign="center" color="subtle">
        Classic: A book which people praise and don’t read.
      </Box>
      <Spacer axis="vertical" size={16} />

      <Box color="subtle" textAlign="center">
        <Spacer axis="vertical" size={16} />
        <p>
          My reading bucketlist.{" "}
          <Box as="span" color="emphasis">
            {data.work.nodes.length.toLocaleString()}
          </Box>{" "}
          titles.
        </p>
        <Spacer axis="vertical" size={16} />
        <p>
          Track my <Link to="/shelf/progress/">progress</Link>.
        </p>
      </Box>
      <Spacer axis="vertical" size={32} />
      <Box display="flex" justifyContent="center">
        <Link
          to="/shelf/authors"
          display="flex"
          columnGap={16}
          boxShadow="borderAll"
          paddingX={16}
          paddingY={8}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={foregroundColors.default}
            width={20}
            height={20}
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Authors
        </Link>
      </Box>
    </CoverListWithFilters>
  );
}

export const pageQuery = graphql`
  fragment ShelfPageAuthor on WorkAuthor {
    name
    sortName
    slug
    notes
  }

  query ShelfPage {
    work: allWorksJson(
      filter: { shelf: { eq: true } }
      sort: [{ authors: { sortName: ASC } }, { yearPublished: ASC }]
    ) {
      nodes {
        title
        yearPublished
        sortTitle
        slug
        kind
        grade
        gradeValue
        authors {
          ...ShelfPageAuthor
        }
        cover {
          ...CoverListCover
        }
      }
      publishedYears: distinct(field: { yearPublished: SELECT })
      authors: distinct(field: { authors: { name: SELECT } })
      kinds: distinct(field: { kind: SELECT })
    }
  }
`;
